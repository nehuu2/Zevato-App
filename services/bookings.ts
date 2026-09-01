import { apiClient } from './api';
import { Booking, BookingStatus, InvoiceData, ServiceReportData } from '../types/booking';

export const bookingService = {
  /**
   * Fetch all bookings for the authenticated user
   */
  getAllBookings: async (status?: string): Promise<Booking[]> => {
    const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.get<Booking[]>(`/bookings${query}`);
  },

  /**
   * Fetch a single booking by ID (validates ownership server-side)
   */
  getBookingById: async (id: string): Promise<Booking> => {
    return apiClient.get<Booking>(`/bookings/${encodeURIComponent(id)}`);
  },

  /**
   * Create a new booking on the backend with authoritative pricing & fake payment
   */
  createBooking: async (payload: {
    serviceOptionId: string;
    addressId?: string;
    address?: any;
    scheduledDate: string;
    scheduledTimeSlot: string;
    paymentMethod: string;
    notes?: string;
    simulatedOutcome?: 'success' | 'failure' | 'cancelled';
  }): Promise<Booking> => {
    return apiClient.post<Booking>('/bookings', payload);
  },

  /**
   * Update booking status (broadcasts real-time event & triggers push notification)
   */
  updateBookingStatus: async (
    id: string,
    status: BookingStatus,
    note?: string
  ): Promise<Booking> => {
    return apiClient.patch<Booking>(`/bookings/${encodeURIComponent(id)}/status`, {
      status,
      note,
    });
  },

  /**
   * Update technician location coordinates (broadcasts real-time coordinate event)
   */
  updateTechnicianLocation: async (
    id: string,
    latitude: number,
    longitude: number,
    estimatedArrivalMinutes = 8
  ): Promise<{ bookingId: string; latitude: number; longitude: number; estimatedArrivalMinutes: number }> => {
    return apiClient.patch(`/bookings/${encodeURIComponent(id)}/technician-location`, {
      latitude,
      longitude,
      estimatedArrivalMinutes,
    });
  },

  /**
   * Execute simulated payment on an existing pending booking
   */
  executeSimulatedPayment: async (
    id: string,
    paymentMethod: string,
    simulatedOutcome: 'success' | 'failure' | 'cancelled' = 'success'
  ): Promise<Booking> => {
    return apiClient.post<Booking>(`/bookings/${encodeURIComponent(id)}/pay`, {
      paymentMethod,
      simulatedOutcome,
    });
  },

  /**
   * Cancel an existing booking
   */
  cancelBooking: async (id: string, reason?: string): Promise<Booking> => {
    return apiClient.post<Booking>(`/bookings/${encodeURIComponent(id)}/cancel`, {
      reason,
    });
  },

  /**
   * Fetch authoritative invoice details from backend
   */
  getBookingInvoice: async (id: string): Promise<InvoiceData> => {
    return apiClient.get<InvoiceData>(`/bookings/${encodeURIComponent(id)}/invoice`);
  },

  /**
   * Fetch service completion report
   */
  getBookingReport: async (id: string): Promise<ServiceReportData> => {
    return apiClient.get<ServiceReportData>(`/bookings/${encodeURIComponent(id)}/report`);
  },

  /**
   * Submit service completion report & rating
   */
  submitServiceRating: async (
    id: string,
    rating: number,
    technicianNotes?: string
  ): Promise<ServiceReportData> => {
    return apiClient.post<ServiceReportData>(`/bookings/${encodeURIComponent(id)}/report`, {
      ratingGiven: rating,
      technicianNotes,
    });
  },
};

export default bookingService;
