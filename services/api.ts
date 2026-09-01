import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Zevota API Client with Clerk JWT Authorization and Resilient Error Handling
 */

let authTokenGetter: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  authTokenGetter = getter;
};

export const getDevServerIp = (): string => {
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

const getBaseUrl = (): string => {
  const devServerIp = getDevServerIp();

  if (process.env.EXPO_PUBLIC_API_URL) {
    try {
      const url = new URL(process.env.EXPO_PUBLIC_API_URL);
      // In development on physical devices (Expo Go), if EXPO_PUBLIC_API_URL points to a different IP than Metro host,
      // adapt automatically to current Metro LAN IP
      if (__DEV__ && devServerIp && devServerIp !== 'localhost' && devServerIp !== '10.0.2.2' && url.hostname !== devServerIp) {
        const port = url.port || '4000';
        const path = url.pathname.replace(/\/$/, '') || '/api';
        return `http://${devServerIp}:${port}${path}`;
      }
      return process.env.EXPO_PUBLIC_API_URL;
    } catch {
      return process.env.EXPO_PUBLIC_API_URL;
    }
  }
  return `http://${devServerIp}:4000/api`;
};


export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string>;

  constructor(message: string, statusCode = 500, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach Clerk JWT if available
  if (authTokenGetter) {
    try {
      const token = await authTokenGetter();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (tokenErr) {
      console.warn('Failed to retrieve Clerk auth token:', tokenErr);
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg =
        responseData?.message ||
        responseData?.error ||
        `HTTP Request failed with status ${response.status}`;
      throw new ApiError(errorMsg, response.status, responseData?.errors);
    }

    // Unpack standardized { success, data } envelope
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData.data as T;
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your internet connection.', 408);
    }
    throw new ApiError(error.message || 'Network request failed.', 503);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>): Promise<T> =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> =>
    request<T>(endpoint, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> =>
    request<T>(endpoint, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> =>
    request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, headers?: Record<string, string>): Promise<T> =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};

export default apiClient;
