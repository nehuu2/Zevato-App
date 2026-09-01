import { apiClient } from './api';
import { UserProfile, Address } from '../types/user';

export const userService = {
  /**
   * Get profile of authenticated user from database
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/me');
  },

  /**
   * Update authenticated user profile in database
   */
  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.patch<UserProfile>('/me', updates);
  },

  /**
   * List all saved addresses from database
   */
  getAddresses: async (): Promise<Address[]> => {
    return apiClient.get<Address[]>('/addresses');
  },

  /**
   * Save a new address in database
   */
  addAddress: async (address: Partial<Address>): Promise<Address> => {
    return apiClient.post<Address>('/addresses', address);
  },

  /**
   * Update an existing address in database
   */
  updateAddress: async (id: string, address: Partial<Address>): Promise<Address> => {
    return apiClient.patch<Address>(`/addresses/${encodeURIComponent(id)}`, address);
  },

  /**
   * Delete an address in database
   */
  deleteAddress: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`/addresses/${encodeURIComponent(id)}`);
  },

  /**
   * Set address as default in database
   */
  setDefaultAddress: async (id: string): Promise<Address> => {
    return apiClient.patch<Address>(`/addresses/${encodeURIComponent(id)}/default`, {});
  },
};

export default userService;
