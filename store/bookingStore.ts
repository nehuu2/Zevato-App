import { Category, Brand, Product, ServiceOption } from '../types/service';
import { Address } from '../types/user';
import { Booking, BookingDraft, BookingStatus, ServiceReportData } from '../types/booking';
import { mockBookings } from '../data/bookings';

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
let confirmedBookings: Booking[] = [...mockBookings];
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

  confirmBooking: (): Booking => {
    const draft = currentBookingDraft;
    const bookingId = 'ZEV-2026-' + Math.floor(10000 + Math.random() * 90000);

    const fallbackOption: ServiceOption = {
      id: 'opt-std',
      title: 'Standard Appliance Service',
      description: 'Comprehensive inspection and diagnostic checkup',
      duration: '45 - 60 mins',
      price: 399,
      features: ['Standard inspection', '30-day warranty'],
      included: ['Diagnosis', 'Basic labor'],
      excluded: ['Parts cost'],
      warrantyDays: 30,
    };

    const fallbackAddress: Address = {
      id: 'addr-default',
      label: 'Home',
      street: 'Customer Delivery Address',
      city: '',
      state: '',
      pincode: '',
      isDefault: true,
    };

    const newBooking: Booking = {
      id: bookingId,
      serviceId: draft.service?.id || 'srv-gen',
      serviceName: draft.service?.title || 'Appliance Repair & Service',
      categoryName: draft.category?.name || 'Home Appliance',
      brandName: draft.brand?.name || undefined,
      productName: draft.product?.name || undefined,
      selectedOption: draft.service || fallbackOption,
      date: draft.date || 'Today',
      timeSlot: draft.timeSlot || '02:00 PM - 04:00 PM',
      address: draft.address || fallbackAddress,
      paymentMethod: draft.paymentMethod || 'UPI Instant Pay',
      paymentStatus: draft.paymentMethod?.includes('Completion') || draft.paymentMethod?.includes('Cash') ? 'cod' : 'paid',
      totalAmount: draft.service?.price || 399,
      discountAmount: draft.discountAmount || 0,
      taxAmount: 0,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      technician: {
        id: 'tech-101',
        name: 'Rajesh Sharma',
        phone: '+91 98765 12345',
        rating: 4.9,
        completedJobs: 420,
        experienceYears: 6,
        specialization: 'Appliance Specialist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      notes: draft.notes,
    };

    confirmedBookings = [newBooking, ...confirmedBookings];
    lastConfirmedBooking = newBooking;
    notifyBookings();

    return newBooking;
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
