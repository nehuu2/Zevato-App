import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConfig from '../constants/config';
import { UserProfile } from '../types/user';

export interface AuthState {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  user: UserProfile | null;
  isLoading: boolean;
}

// In-memory fallback / cache
let currentAuthState: AuthState = {
  isAuthenticated: false,
  isOnboardingCompleted: false,
  user: null,
  isLoading: true,
};

const listeners = new Set<(state: AuthState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentAuthState }));
}

export const authStore = {
  getState: (): AuthState => ({ ...currentAuthState }),

  subscribe: (listener: (state: AuthState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Loads persisted onboarding status and session from AsyncStorage
   */
  loadInitialState: async (): Promise<boolean> => {
    try {
      const onboardingValue = await AsyncStorage.getItem(AppConfig.storageKeys.onboardingCompleted);
      const isOnboardingCompleted = onboardingValue === 'true';
      
      const sessionValue = await AsyncStorage.getItem(AppConfig.storageKeys.userSession);
      let user: UserProfile | null = null;
      let isAuthenticated = false;

      if (sessionValue) {
        try {
          user = JSON.parse(sessionValue);
          isAuthenticated = true;
        } catch {
          user = null;
        }
      }

      currentAuthState = {
        ...currentAuthState,
        isOnboardingCompleted,
        isAuthenticated,
        user,
        isLoading: false,
      };
      notify();
      return isOnboardingCompleted;
    } catch (e) {
      console.warn('Failed to load auth/onboarding state:', e);
      currentAuthState = {
        ...currentAuthState,
        isOnboardingCompleted: false,
        isLoading: false,
      };
      notify();
      return false;
    }
  },

  /**
   * Marks the onboarding flow as completed and saves to AsyncStorage
   */
  setOnboardingCompleted: async (completed = true): Promise<void> => {
    try {
      await AsyncStorage.setItem(AppConfig.storageKeys.onboardingCompleted, completed ? 'true' : 'false');
      currentAuthState.isOnboardingCompleted = completed;
      notify();
    } catch (e) {
      console.error('Failed to set onboarding state:', e);
    }
  },

  /**
   * Resets onboarding state (useful for dev testing / logout)
   */
  resetOnboarding: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AppConfig.storageKeys.onboardingCompleted);
      currentAuthState.isOnboardingCompleted = false;
      notify();
    } catch (e) {
      console.error('Failed to reset onboarding state:', e);
    }
  },

  /**
   * Mock login / session setting
   */
  login: async (user: UserProfile): Promise<void> => {
    try {
      await AsyncStorage.setItem(AppConfig.storageKeys.userSession, JSON.stringify(user));
      currentAuthState.isAuthenticated = true;
      currentAuthState.user = user;
      notify();
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
  },

  /**
   * Log out user
   */
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AppConfig.storageKeys.userSession);
      currentAuthState.isAuthenticated = false;
      currentAuthState.user = null;
      notify();
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  },
};

export default authStore;
