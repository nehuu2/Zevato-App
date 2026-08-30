import { apiClient } from './api';
import { Booking } from '../types/booking';
import { mockBookings } from '../data/bookings';

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    return apiClient.get('/bookings', mockBookings);
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];
    return apiClient.get(`/bookings/${id}`, booking);
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const newBooking: Booking = {
      id: 'BK-' + Math.floor(10000 + Math.random() * 90000),
      serviceId: bookingData.serviceId || 'srv-default',
      serviceName: bookingData.serviceName || 'Appliance Service',
      categoryName: bookingData.categoryName || 'General',
      selectedOption: bookingData.selectedOption || {
        id: 'opt-1',
        title: 'Standard Service',
        description: 'Standard repair and maintenance',
        duration: '60 mins',
        price: 499,
        features: ['Standard inspection'],
        included: ['Labor'],
        excluded: ['Parts'],
        warrantyDays: 30,
      },
      date: bookingData.date || 'Tomorrow',
      timeSlot: bookingData.timeSlot || '10:00 AM - 12:00 PM',
      address: bookingData.address || {
        id: 'addr-new',
        label: 'Home',
        street: '123 Main Street',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
      },
      paymentMethod: bookingData.paymentMethod || 'UPI / Online',
      paymentStatus: 'paid',
      totalAmount: bookingData.totalAmount || 499,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    return apiClient.post('/bookings', bookingData, newBooking);
  },

  cancelBooking: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(`/bookings/${id}/cancel`, { reason }, {
      success: true,
      message: 'Booking cancelled successfully.',
    });
  },
};

export default bookingService;
