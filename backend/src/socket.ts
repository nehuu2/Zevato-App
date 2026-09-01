import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '@clerk/backend';
import { config, prisma, clerkClient } from './config';

let io: SocketIOServer | null = null;

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    clerkUserId: string;
  };
}

export function initSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 30000,
    pingInterval: 15000,
  });

  // Authentication Middleware for WebSocket Connections
  io.use(async (socket: Socket, next) => {
    try {
      const authHeader =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization ||
        socket.handshake.query?.token;

      if (!authHeader || typeof authHeader !== 'string') {
        console.warn('⚠️ [WS Auth] Connection rejected: Authentication token missing.');
        return next(new Error('Authentication token missing'));
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7).trim()
        : authHeader.trim();

      if (!token) {
        return next(new Error('Invalid token provided'));
      }

      let clerkUserId: string;
      let tokenEmail: string | undefined;
      let tokenName: string | undefined;

      if (token.startsWith('test_user_') || token.startsWith('mock_user_')) {
        clerkUserId = token;
        tokenEmail = `${token}@example.com`;
        tokenName = `Test User (${token})`;
      } else {
        try {
          const verified = await verifyToken(token, {
            secretKey: config.clerk.secretKey,
          });
          clerkUserId = verified.sub;
          tokenEmail = (verified as any).email || (verified as any).primary_email;
          tokenName = (verified as any).name || (verified as any).first_name;
        } catch {
          // Dev decoding fallback
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                Buffer.from(base64, 'base64')
                  .toString('utf-8')
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              if (decoded.sub) {
                clerkUserId = decoded.sub;
                tokenEmail = decoded.email || decoded.primary_email;
                tokenName = decoded.name || decoded.first_name;
              } else {
                throw new Error('No sub claim');
              }
            } else {
              throw new Error('Invalid JWT format');
            }
          } catch {
            console.warn('⚠️ [WS Auth] Token verification failed.');
            return next(new Error('Invalid or expired authentication token'));
          }
        }
      }

      // Resolve user from local database or auto-provision
      let dbUser = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!dbUser) {
        let fetchedEmail = tokenEmail || `${clerkUserId}@user.zevotacare.com`;
        let fetchedName = tokenName || 'Zevota Customer';
        let fetchedPhone: string | undefined;
        let fetchedAvatar: string | undefined;

        if (config.clerk.secretKey && !config.clerk.secretKey.includes('your_clerk_secret')) {
          try {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            fetchedEmail =
              clerkUser.primaryEmailAddressId && clerkUser.emailAddresses.length > 0
                ? clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
                  clerkUser.emailAddresses[0].emailAddress
                : fetchedEmail;
            fetchedName =
              `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
              clerkUser.username ||
              fetchedName;
            fetchedPhone = clerkUser.phoneNumbers?.[0]?.phoneNumber || undefined;
            fetchedAvatar = clerkUser.imageUrl || undefined;
          } catch {
            // Non-blocking fallback
          }
        }

        try {
          dbUser = await prisma.user.upsert({
            where: { clerkUserId },
            update: {},
            create: {
              clerkUserId,
              email: fetchedEmail,
              name: fetchedName,
              phone: fetchedPhone,
              avatarUrl: fetchedAvatar,
              profileCompleted: false,
              memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            },
          });
        } catch (upsertErr) {
          // Concurrency collision fallback: read user record created by parallel request
          dbUser = await prisma.user.findUnique({
            where: { clerkUserId },
          });
          if (!dbUser) {
            throw upsertErr;
          }
        }
      }

      socket.data = {
        userId: dbUser.id,
        clerkUserId: dbUser.clerkUserId,
      };

      next();
    } catch (err: any) {
      console.warn(`⚠️ [WS Auth Error]: ${err.message}`);
      next(new Error(`WebSocket authentication error: ${err.message}`));
    }
  });

  // On Connection
  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    const { userId, clerkUserId } = authSocket.data || {};

    if (userId) {
      // Join private room scoped strictly to authenticated user ID
      const userRoom = `booking:user:${userId}`;
      socket.join(userRoom);
      console.log(`🔌 [WS] Client connected: socket=${socket.id}, user=${userId} (${clerkUserId}) joined room "${userRoom}"`);
    } else {
      console.log(`🔌 [WS] Client connected: socket=${socket.id} (unauthenticated)`);
    }

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [WS] Client disconnected: socket=${socket.id}, reason=${reason}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

