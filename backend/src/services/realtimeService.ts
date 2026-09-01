import { getIO } from '../socket';

export type RealtimeEventType =
  | 'booking.created'
  | 'booking.status_changed'
  | 'technician.assigned'
  | 'technician.location_updated'
  | 'booking.cancelled'
  | 'payment.updated'
  | 'booking.completed';

export interface RealtimeEventPayload {
  event: RealtimeEventType;
  bookingId: string;
  timestamp: string;
  data: any;
}

export const realtimeService = {
  /**
   * Emit a real-time event to a specific user's private channel
   */
  emitToUser: (userId: string, event: RealtimeEventType, bookingId: string, data: any): void => {
    const io = getIO();
    if (!io) {
      // Socket not yet initialized or in testing without WS
      return;
    }

    const userRoom = `booking:user:${userId}`;
    const payload: RealtimeEventPayload = {
      event,
      bookingId,
      timestamp: new Date().toISOString(),
      data,
    };

    io.to(userRoom).emit(event, payload);
    io.to(userRoom).emit('booking:update', payload); // Universal fallback event

    console.log(`📡 [WS Emit] ${event} -> room "${userRoom}" for booking #${bookingId}`);
  },

  /**
   * Helper: Emit booking status changed
   */
  emitStatusChanged: (userId: string, bookingId: string, status: string, bookingData: any): void => {
    realtimeService.emitToUser(userId, 'booking.status_changed', bookingId, {
      status,
      booking: bookingData,
    });
  },

  /**
   * Helper: Emit technician location update
   */
  emitTechnicianLocation: (
    userId: string,
    bookingId: string,
    technicianId: string,
    location: { latitude: number; longitude: number; estimatedArrivalMinutes?: number }
  ): void => {
    realtimeService.emitToUser(userId, 'technician.location_updated', bookingId, {
      technicianId,
      location,
    });
  },

  /**
   * Helper: Emit payment status update
   */
  emitPaymentUpdated: (userId: string, bookingId: string, paymentStatus: string, paymentData: any): void => {
    realtimeService.emitToUser(userId, 'payment.updated', bookingId, {
      paymentStatus,
      payment: paymentData,
    });
  },
};

export default realtimeService;
