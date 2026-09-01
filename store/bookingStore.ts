import { Category, Brand, Product, ServiceOption } from '../types/service';
import { Address } from '../types/user';
import { Booking, BookingDraft, BookingStatus, ServiceReportData } from '../types/booking';

export { BookingDraft };

const initialDraft: BookingDraft = {
  category: null,
  brand: null,
  product: null,
  service: null,
  date: null,
  timeSlot: null,
  address: null,
  paymentMethod: 'UPI Instant Pay',
  notes: '',
  discountAmount: 0,
};

let currentBookingDraft: BookingDraft = { ...initialDraft };
let confirmedBookings: Booking[] = [];
let lastConfirmedBooking: Booking | null = null;

const draftListeners = new Set<(draft: BookingDraft) => void>();
const bookingListListeners = new Set<(bookings: Booking[]) => void>();

function notifyDraft() {
  draftListeners.forEach((listener) => listener({ ...currentBookingDraft }));
}

function notifyBookings() {
  bookingListListeners.forEach((listener) => listener([...confirmedBookings]));
}

export const bookingStore = {
  getState: (): BookingDraft => ({ ...currentBookingDraft }),

  subscribe: (listener: (state: BookingDraft) => void) => {
    draftListeners.add(listener);
    return () => {
      draftListeners.delete(listener);
    };
  },

  subscribeBookings: (listener: (bookings: Booking[]) => void) => {
    bookingListListeners.add(listener);
    return () => {
      bookingListListeners.delete(listener);
    };
  },

  setCategory: (category: Category | null) => {
    currentBookingDraft = { ...currentBookingDraft, category };
    notifyDraft();
  },

  setBrand: (brand: Brand | null) => {
    currentBookingDraft = { ...currentBookingDraft, brand };
    notifyDraft();
  },

  setProduct: (product: Product | null) => {
    currentBookingDraft = { ...currentBookingDraft, product };
    notifyDraft();
  },

  setService: (service: ServiceOption | null) => {
    currentBookingDraft = { ...currentBookingDraft, service };
    notifyDraft();
  },

  setSchedule: (date: string, timeSlot: string) => {
    currentBookingDraft = { ...currentBookingDraft, date, timeSlot };
    notifyDraft();
  },

  setAddress: (address: Address | null) => {
    currentBookingDraft = { ...currentBookingDraft, address };
    notifyDraft();
  },

  setPaymentMethod: (paymentMethod: string) => {
    currentBookingDraft = { ...currentBookingDraft, paymentMethod };
    notifyDraft();
  },

  setNotes: (notes: string) => {
    currentBookingDraft = { ...currentBookingDraft, notes };
    notifyDraft();
  },

  setConfirmedBookings: (bookings: Booking[]) => {
    confirmedBookings = bookings;
    notifyBookings();
  },

  addConfirmedBooking: (booking: Booking) => {
    confirmedBookings = [booking, ...confirmedBookings.filter((b) => b.id !== booking.id)];
    lastConfirmedBooking = booking;
    notifyBookings();
  },

  updateBookingStatus: (id: string, status: BookingStatus): Booking | undefined => {
    const index = confirmedBookings.findIndex((b) => b.id === id || b.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      const updated: Booking = {
        ...confirmedBookings[index],
        status,
      };

      if (status === 'completed' && !updated.serviceReport) {
        updated.serviceReport = {
          technicianNotes: 'Diagnostic checkup completed. System cleaned, tested, and full performance verified.',
          partsReplaced: [],
          warrantyUntil: '30 Days from today',
          ratingGiven: 5,
        };
      }

      confirmedBookings[index] = updated;
      if (lastConfirmedBooking?.id === id) {
        lastConfirmedBooking = updated;
      }
      notifyBookings();
      return updated;
    }
    return undefined;
  },

  cancelBooking: (id: string, reason?: string): Booking | undefined => {
    const index = confirmedBookings.findIndex((b) => b.id === id || b.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      const updated: Booking = {
        ...confirmedBookings[index],
        status: 'cancelled',
        cancellationReason: reason || 'Cancelled by customer',
      };
      confirmedBookings[index] = updated;
      if (lastConfirmedBooking?.id === id) {
        lastConfirmedBooking = updated;
      }
      notifyBookings();
      return updated;
    }
    return undefined;
  },

  addServiceReport: (id: string, report: ServiceReportData): Booking | undefined => {
    const index = confirmedBookings.findIndex((b) => b.id === id || b.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      const updated: Booking = {
        ...confirmedBookings[index],
        serviceReport: report,
      };
      confirmedBookings[index] = updated;
      notifyBookings();
      return updated;
    }
    return undefined;
  },

  getLastConfirmedBooking: (): Booking | null => {
    return lastConfirmedBooking;
  },

  setLastConfirmedBooking: (booking: Booking | null) => {
    lastConfirmedBooking = booking;
  },

  getConfirmedBookings: (): Booking[] => {
    return [...confirmedBookings];
  },

  getBookingById: (id: string): Booking | undefined => {
    return confirmedBookings.find((b) => b.id === id || b.id.toLowerCase() === id.toLowerCase());
  },

  resetBooking: () => {
    currentBookingDraft = { ...initialDraft };
    notifyDraft();
  },
};

export default bookingStore;
