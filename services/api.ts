/**
 * Base mock API client with simulated delays and safe error handling.
 */

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export const apiClient = {
  get: async <T>(endpoint: string, mockData: T): Promise<T> => {
    await delay(300);
    return mockData;
  },
  post: async <T>(endpoint: string, data: any, response: T): Promise<T> => {
    await delay(400);
    return response;
  },
};

export default apiClient;
