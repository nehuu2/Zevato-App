import { Address } from './user';
import { Category, Brand, Product, ServiceOption } from './service';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'technician_assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedJobs: number;
  avatar?: string;
  experienceYears: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  brandName?: string;
  productName?: string;
  selectedOption: ServiceOption;
  date: string;
  timeSlot: string;
  address: Address;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'cod';
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  status: BookingStatus;
  createdAt: string;
  technician?: Technician;
  notes?: string;
  invoiceUrl?: string;
}

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
  discountAmount?: number;
}

export interface DateOption {
  id: string;
  dayName: string;
  dateStr: string;
  isToday?: boolean;
  fullDate?: string;
}

export interface TimeSlotOption {
  id: string;
  time: string;
  available: boolean;
  period?: 'morning' | 'afternoon' | 'evening';
}
