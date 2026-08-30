import { Category, Brand, Product, ServiceOption } from '../types/service';
import { Address } from '../types/user';

export interface BookingDraft {
  category: Category | null;
  brand: Brand | null;
  product: Product | null;
  service: ServiceOption | null;
  date: string | null;
  timeSlot: string | null;
  address: Address | null;
  paymentMethod: string | null;
  notes: string;
}

const initialDraft: BookingDraft = {
  category: null,
  brand: null,
  product: null,
  service: null,
  date: null,
  timeSlot: null,
  address: null,
  paymentMethod: 'UPI / Online',
  notes: '',
};

let currentBookingState: BookingDraft = { ...initialDraft };
const listeners = new Set<(state: BookingDraft) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentBookingState }));
}

export const bookingStore = {
  getState: (): BookingDraft => ({ ...currentBookingState }),

  subscribe: (listener: (state: BookingDraft) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setCategory: (category: Category | null) => {
    currentBookingState = { ...currentBookingState, category };
    notify();
  },

  setBrand: (brand: Brand | null) => {
    currentBookingState = { ...currentBookingState, brand };
    notify();
  },

  setProduct: (product: Product | null) => {
    currentBookingState = { ...currentBookingState, product };
    notify();
  },

  setService: (service: ServiceOption | null) => {
    currentBookingState = { ...currentBookingState, service };
    notify();
  },

  setSchedule: (date: string, timeSlot: string) => {
    currentBookingState = { ...currentBookingState, date, timeSlot };
    notify();
  },

  setAddress: (address: Address | null) => {
    currentBookingState = { ...currentBookingState, address };
    notify();
  },

  setPaymentMethod: (paymentMethod: string) => {
    currentBookingState = { ...currentBookingState, paymentMethod };
    notify();
  },

  setNotes: (notes: string) => {
    currentBookingState = { ...currentBookingState, notes };
    notify();
  },

  resetBooking: () => {
    currentBookingState = { ...initialDraft };
    notify();
  },
};

export default bookingStore;
