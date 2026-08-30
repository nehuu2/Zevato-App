import { useState, useEffect } from 'react';
import { authStore, AuthState } from '../store/authStore';

export function useAuth() {
  const [state, setState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setState);
    authStore.loadInitialState();
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    login: authStore.login,
    logout: authStore.logout,
    setOnboardingCompleted: authStore.setOnboardingCompleted,
    resetOnboarding: authStore.resetOnboarding,
  };
}

export default useAuth;
