import { useEffect } from 'react';
import { useAuth } from '@clerk/expo';
import { socketService } from '../services/socket';
import { bookingStore } from '../store/bookingStore';
import { bookingService } from '../services/bookings';
import { Booking } from '../types/booking';

/**
 * Custom hook to manage real-time booking updates via Socket.IO
 * and synchronize with the local bookingStore.
 */
export function useRealtimeBookings() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      socketService.disconnect();
      return;
    }

    let isMounted = true;

    const initRealtime = async () => {
      const socket = await socketService.connect(getToken);
      if (!socket || !isMounted) return;

      // Handle booking created event
      socket.on('booking.created', (payload: { bookingId: string; data: Booking }) => {
        if (payload?.data) {
          bookingStore.addConfirmedBooking(payload.data);
        }
      });

      // Handle booking status changed
      socket.on('booking.status_changed', (payload: { bookingId: string; data: { status: any; booking?: Booking } }) => {
        if (payload?.bookingId && payload?.data?.status) {
          bookingStore.updateBookingStatus(payload.bookingId, payload.data.status);
          if (payload.data.booking) {
            bookingStore.addConfirmedBooking(payload.data.booking);
          }
        }
      });

      // Handle technician assigned
      socket.on('technician.assigned', (payload: { bookingId: string; data: { technician: any } }) => {
        if (payload?.bookingId) {
          const current = bookingStore.getBookingById(payload.bookingId);
          if (current && payload.data.technician) {
            current.technician = payload.data.technician;
            bookingStore.addConfirmedBooking(current);
          }
        }
      });

      // Handle technician location update
      socket.on('technician.location_updated', (payload: { bookingId: string; data: { location: any } }) => {
        if (payload?.bookingId && payload?.data?.location) {
          const current = bookingStore.getBookingById(payload.bookingId);
          if (current && current.technician) {
            current.technician.currentLocation = {
              latitude: payload.data.location.latitude,
              longitude: payload.data.location.longitude,
            };
            bookingStore.addConfirmedBooking(current);
          }
        }
      });

      // Handle booking cancelled
      socket.on('booking.cancelled', (payload: { bookingId: string; data: Booking }) => {
        if (payload?.bookingId) {
          bookingStore.cancelBooking(payload.bookingId, payload.data?.cancellationReason);
          if (payload.data) {
            bookingStore.addConfirmedBooking(payload.data);
          }
        }
      });

      // Handle booking completed
      socket.on('booking.completed', (payload: { bookingId: string; data: Booking }) => {
        if (payload?.bookingId) {
          bookingStore.updateBookingStatus(payload.bookingId, 'completed');
          if (payload.data) {
            bookingStore.addConfirmedBooking(payload.data);
          }
        }
      });

      // Handle universal booking update fallback
      socket.on('booking:update', (payload: { bookingId: string; data: any }) => {
        if (payload?.data && payload.data.id) {
          bookingStore.addConfirmedBooking(payload.data);
        }
      });

      // Handle reconnection -> Refresh live bookings from REST API
      socket.on('connect', async () => {
        try {
          const freshList = await bookingService.getAllBookings();
          bookingStore.setConfirmedBookings(freshList);
        } catch (err) {
          console.warn('⚡ [Socket Reconnect Sync Warning]:', err);
        }
      });
    };

    initRealtime();

    return () => {
      isMounted = false;
      // Clean up socket listeners on unmount
    };
  }, [isSignedIn, getToken]);
}

export default useRealtimeBookings;
