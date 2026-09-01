import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { isRunningInExpoGo } from 'expo';
import { pushNotificationService } from '../services/notifications';

/**
 * Custom hook to initialize Expo push notifications and handle foreground notifications
 */
export function usePushNotifications() {
  const { isSignedIn } = useAuth();
  const notificationListener = useRef<{ remove: () => void } | null>(null);
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    // Register token on user sign in
    pushNotificationService.registerForPushNotificationsAsync();

    // Push listeners are only active outside Expo Go (development build or standalone APK)
    if (!isRunningInExpoGo()) {
      try {
        const Notifications = require('expo-notifications');
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
          console.log('🔔 Foreground Notification Received:', notification.request.content.title);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
          console.log('👉 User tapped notification:', response.notification.request.content.data);
        });
      } catch (e) {
        console.warn('Push notification listener init error:', e);
      }
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isSignedIn]);
}

export default usePushNotifications;
