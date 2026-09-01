import { userService } from './users';
import { UserProfile } from '../types/user';

/**
 * Authentication service interface.
 * Clerk is the primary source of truth for identity, sign-in, and credentials.
 * Application profile data is synchronized with the Zevota backend database.
 */
export const authService = {
  /**
   * Fetch current authenticated user profile from backend database
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    return userService.getProfile();
  },

  /**
   * Synchronize profile updates to backend database
   */
  syncProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    return userService.updateProfile(updates);
  },
};

export default authService;
