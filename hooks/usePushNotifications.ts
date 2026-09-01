import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import * as Notifications from 'expo-notifications';
import { pushNotificationService } from '../services/notifications';

/**
 * Custom hook to initialize Expo push notifications and handle foreground notifications
 */
export function usePushNotifications() {
  const { isSignedIn } = useAuth();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    // Register token on user sign in
    pushNotificationService.registerForPushNotificationsAsync();

    // Listen for incoming notifications when app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Foreground Notification Received:', notification.request.content.title);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👉 User tapped notification:', response.notification.request.content.data);
    });

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
