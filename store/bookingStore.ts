import { Category, Brand, Product, ServiceOption } from '../types/service';
import { Address } from '../types/user';
import { Booking, BookingDraft } from '../types/booking';
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

const listeners = new Set<(draft: BookingDraft) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentBookingDraft }));
}

export const bookingStore = {
  getState: (): BookingDraft => ({ ...currentBookingDraft }),

  subscribe: (listener: (state: BookingDraft) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setCategory: (category: Category | null) => {
    currentBookingDraft = { ...currentBookingDraft, category };
    notify();
  },

  setBrand: (brand: Brand | null) => {
    currentBookingDraft = { ...currentBookingDraft, brand };
    notify();
  },

  setProduct: (product: Product | null) => {
    currentBookingDraft = { ...currentBookingDraft, product };
    notify();
  },

  setService: (service: ServiceOption | null) => {
    currentBookingDraft = { ...currentBookingDraft, service };
    notify();
  },

  setSchedule: (date: string, timeSlot: string) => {
    currentBookingDraft = { ...currentBookingDraft, date, timeSlot };
    notify();
  },

  setAddress: (address: Address | null) => {
    currentBookingDraft = { ...currentBookingDraft, address };
    notify();
  },

  setPaymentMethod: (paymentMethod: string) => {
    currentBookingDraft = { ...currentBookingDraft, paymentMethod };
    notify();
  },

  setNotes: (notes: string) => {
    currentBookingDraft = { ...currentBookingDraft, notes };
    notify();
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
      street: 'Sector 48, Sohna Road',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
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
        id: 'tech-assigning',
        name: 'Technician Assigning...',
        phone: '+91 98765 00000',
        rating: 4.9,
        completedJobs: 350,
        experienceYears: 5,
      },
      notes: draft.notes,
    };

    confirmedBookings = [newBooking, ...confirmedBookings];
    lastConfirmedBooking = newBooking;

    return newBooking;
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
    notify();
  },
};

export default bookingStore;
