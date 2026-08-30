import { apiClient } from './api';
import { UserProfile, Address } from '../types/user';
import { userStore } from '../store/userStore';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get('/user/profile', userStore.getState());
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    userStore.updateProfile(updates);
    return apiClient.post('/user/profile', updates, userStore.getState());
  },

  addAddress: async (address: Address): Promise<Address[]> => {
    userStore.addAddress(address);
    return apiClient.post('/user/addresses', address, userStore.getState().addresses);
  },
};

export default userService;
