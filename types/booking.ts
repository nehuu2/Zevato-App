import { Address } from './user';
import { ServiceOption } from './service';

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
