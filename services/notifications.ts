import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';
import { apiClient } from './api';

let Notifications: typeof import('expo-notifications') | null = null;

// Only load and initialize native push notification handlers outside of Expo Go
if (!isRunningInExpoGo()) {
  try {
    Notifications = require('expo-notifications');
    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (err) {
    console.warn('Failed to load expo-notifications:', err);
  }
}

export const pushNotificationService = {
  /**
   * Request push notification permission and register Expo push token with backend
   */
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    // In Expo Go or non-physical simulators, use simulated push token
    if (isRunningInExpoGo() || !Device.isDevice) {
      console.log('ℹ️ Push notifications in Expo Go/Simulator running in simulation mode.');
      const simToken = `ExponentPushToken[SIM_DEV_${Platform.OS}_${Date.now()}]`;
      try {
        await apiClient.post('/notifications/register-token', {
          token: simToken,
          platform: Platform.OS,
        });
      } catch (err) {
        console.warn('Sim token registration notice:', err);
      }
      return simToken;
    }

    if (!Notifications) {
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('ℹ️ Push notification permission not granted by user.');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      // Register with backend database
      await apiClient.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
      });

      console.log('📱 Registered device push token with backend:', token);
      return token;
    } catch (error: any) {
      console.warn('⚠️ Push notification registration failed:', error.message);
      return null;
    }
  },

  /**
   * Unregister push token on logout
   */
  unregisterPushToken: async (token: string): Promise<void> => {
    try {
      await apiClient.post('/notifications/unregister-token', { token });
    } catch (err) {
      console.warn('Unregister token error:', err);
    }
  },
};

export default pushNotificationService;
