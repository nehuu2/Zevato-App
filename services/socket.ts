import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

let socket: Socket | null = null;
let currentTokenGetter: (() => Promise<string | null>) | null = null;

const getDevServerIp = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  const debuggerHost = (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

const getWsUrl = (): string => {
  const devServerIp = getDevServerIp();

  if (process.env.EXPO_PUBLIC_API_URL) {
    try {
      const url = new URL(process.env.EXPO_PUBLIC_API_URL);
      // In development on physical devices (Expo Go), if EXPO_PUBLIC_API_URL points to a different IP than Metro host,
      // adapt automatically to current Metro LAN IP
      if (__DEV__ && devServerIp && devServerIp !== 'localhost' && devServerIp !== '10.0.2.2' && url.hostname !== devServerIp) {
        const port = url.port || '4000';
        return `http://${devServerIp}:${port}`;
      }
      return `${url.protocol}//${url.host}`;
    } catch {
      return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '');
    }
  }
  return `http://${devServerIp}:4000`;
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

      if (socket) {
        if (socket.connected) {
          return socket;
        }
        socket.auth = { token };
        socket.connect();
        return socket;
      }

      const wsUrl = getWsUrl();
      console.log(`⚡ [Socket] Connecting to ${wsUrl}...`);

      socket = io(wsUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
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
