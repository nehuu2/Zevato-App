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
  specialization?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface ServiceReportData {
  technicianNotes: string;
  partsReplaced?: string[];
  warrantyUntil: string;
  ratingGiven?: number;
}

export interface InvoiceData {
  id?: string;
  bookingId?: string;
  invoiceNumber: string;
  customerName?: string;
  customerAddress?: string;
  serviceName?: string;
  categoryName?: string;
  brandName?: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  issuedAt: string;
}

export interface BookingStatusHistoryItem {
  id: string;
  status: BookingStatus;
  note?: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  bookingNumber?: string;
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
  paymentMethodType?: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'cancelled' | 'cod';
  simulatedTransactionId?: string;
  paidAt?: string;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  status: BookingStatus;
  estimatedArrivalMinutes?: number;
  createdAt: string;
  technician?: Technician;
  serviceReport?: ServiceReportData;
  invoice?: InvoiceData;
  notes?: string;
  cancellationReason?: string;
  invoiceUrl?: string;
  statusHistory?: BookingStatusHistoryItem[];
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
