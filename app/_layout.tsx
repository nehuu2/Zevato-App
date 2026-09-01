import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { setAuthTokenGetter } from '../services/api';
import { useRealtimeBookings } from '../hooks/useRealtimeBookings';
import { usePushNotifications } from '../hooks/usePushNotifications';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

function AuthTokenBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  // Mount real-time booking synchronization & push notifications
  useRealtimeBookings();
  usePushNotifications();

  return <>{children}</>;
}

export default function RootLayout() {
  const content = (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );

  if (publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <AuthTokenBridge>{content}</AuthTokenBridge>
      </ClerkProvider>
    );
  }

  return content;
}
