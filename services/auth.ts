import { apiClient } from './api';
import { UserProfile } from '../types/user';

export const authService = {
  loginWithPhone: async (phone: string, otp: string): Promise<UserProfile> => {
    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: 'User',
      email: 'user@example.com',
      phone,
      addresses: [],
      paymentMethods: [],
    };
    return apiClient.post('/auth/login', { phone, otp }, mockUser);
  },

  signUp: async (name: string, email: string, phone: string): Promise<UserProfile> => {
    const mockUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      addresses: [],
      paymentMethods: [],
    };
    return apiClient.post('/auth/signup', { name, email, phone }, mockUser);
  },
};

export default authService;
