import { apiClient } from './api';
import { Booking, BookingStatus } from '../types/booking';
import { bookingStore } from '../store/bookingStore';

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const list = bookingStore.getConfirmedBookings();
    return apiClient.get('/bookings', list);
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    const booking = bookingStore.getBookingById(id);
    return apiClient.get(`/bookings/${id}`, booking);
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const created = bookingStore.confirmBooking();
    return apiClient.post('/bookings', bookingData, created);
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking | undefined> => {
    const updated = bookingStore.updateBookingStatus(id, status);
    return apiClient.post(`/bookings/${id}/status`, { status }, updated);
  },

  cancelBooking: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    bookingStore.cancelBooking(id, reason);
    return apiClient.post(`/bookings/${id}/cancel`, { reason }, {
      success: true,
      message: 'Booking cancelled successfully.',
    });
  },
};

export default bookingService;
