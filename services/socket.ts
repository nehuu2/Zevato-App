import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

let socket: Socket | null = null;
let currentTokenGetter: (() => Promise<string | null>) | null = null;

const getWsUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    const url = new URL(process.env.EXPO_PUBLIC_API_URL);
    return `${url.protocol}//${url.host}`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  return 'http://localhost:4000';
};

export const socketService = {
  /**
   * Initialize and connect Socket.IO client with Clerk token
   */
  connect: async (tokenGetter: () => Promise<string | null>): Promise<Socket | null> => {
    currentTokenGetter = tokenGetter;

    try {
      const token = await tokenGetter();
      if (!token) {
        console.log('⚡ [Socket] No Clerk auth token available yet.');
        return null;
      }

      if (socket && socket.connected) {
        return socket;
      }

      const wsUrl = getWsUrl();

      socket = io(wsUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socket.on('connect', () => {
        console.log('⚡ [Socket Connected] ID:', socket?.id);
      });

      socket.on('connect_error', async (err) => {
        console.warn('⚡ [Socket Connection Error]:', err.message);
        // Refresh auth token on connection error
        if (currentTokenGetter && socket) {
          try {
            const freshToken = await currentTokenGetter();
            if (freshToken) {
              socket.auth = { token: freshToken };
            }
          } catch (tErr) {
            console.warn('⚡ [Socket Refresh Token Failed]:', tErr);
          }
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('⚡ [Socket Disconnected]:', reason);
      });

      return socket;
    } catch (e: any) {
      console.warn('⚡ [Socket Init Error]:', e.message);
      return null;
    }
  },

  /**
   * Get active socket instance
   */
  getSocket: (): Socket | null => socket,

  /**
   * Disconnect socket
   */
  disconnect: (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  /**
   * Subscribe to specific real-time booking event
   */
  on: (event: string, callback: (data: any) => void): (() => void) => {
    if (socket) {
      socket.on(event, callback);
    }
    return () => {
      if (socket) {
        socket.off(event, callback);
      }
    };
  },
};

export default socketService;
