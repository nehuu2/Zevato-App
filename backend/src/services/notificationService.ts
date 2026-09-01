import { prisma } from '../config';

export interface PushNotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
}

export const notificationService = {
  /**
   * Send push notification to all registered devices for a user via Expo Push API
   */
  sendToUser: async (payload: PushNotificationPayload): Promise<void> => {
    const { userId, title, body, data = {} } = payload;

    try {
      // Find all registered push tokens for this user
      const userTokens = await prisma.pushDeviceToken.findMany({
        where: { userId },
      });

      if (userTokens.length === 0) {
        console.log(`ℹ️ [Push] No registered device tokens for user ${userId}`);
        return;
      }

      // Build Expo push message objects
      const messages = userTokens.map((t) => ({
        to: t.token,
        sound: 'default',
        title,
        body,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
      }));

      // Send to Expo Push Notification gateway
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const resData = await response.json();
      console.log(`📱 [Push Notification Sent] User=${userId}, Title="${title}", Devices=${userTokens.length}`, resData);
    } catch (err: any) {
      console.warn(`⚠️ [Push Notification Warning] Failed to send push to user ${userId}:`, err.message);
    }
  },

  /**
   * Helper for booking lifecycle push notifications
   */
  notifyBookingStatus: async (
    userId: string,
    bookingNumber: string,
    serviceName: string,
    status: string,
    technicianName?: string
  ): Promise<void> => {
    let title = 'Booking Update';
    let body = `Your booking #${bookingNumber} is now ${status}.`;

    switch (status) {
      case 'confirmed':
        title = '🎉 Booking Confirmed!';
        body = `Your ${serviceName} booking #${bookingNumber} is confirmed.`;
        break;
      case 'technician_assigned':
        title = '👨‍🔧 Technician Assigned';
        body = `${technicianName || 'A technician'} has been assigned to your service #${bookingNumber}.`;
        break;
      case 'on_the_way':
        title = '🚗 Technician On The Way';
        body = `${technicianName || 'Your technician'} is on the way to your address.`;
        break;
      case 'in_progress':
        title = '🛠️ Service In Progress';
        body = `Service #${bookingNumber} for ${serviceName} has started.`;
        break;
      case 'completed':
        title = '✅ Service Completed!';
        body = `Your ${serviceName} service is complete with 30-day rework warranty.`;
        break;
      case 'cancelled':
        title = '❌ Booking Cancelled';
        body = `Your booking #${bookingNumber} has been cancelled.`;
        break;
    }

    await notificationService.sendToUser({
      userId,
      title,
      body,
      data: {
        bookingNumber,
        status,
        type: 'booking_status',
      },
    });
  },
};

export default notificationService;
