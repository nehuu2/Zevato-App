import { Request } from 'express';

export interface AuthenticatedUser {
  id: string; // Database User ID
  clerkUserId: string; // Clerk User ID
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  profileCompleted: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  clerkUserId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface CreateAddressDto {
  label?: 'Home' | 'Work' | 'Other';
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  profileCompleted?: boolean;
}

export interface CreateBookingDto {
  serviceOptionId: string;
  addressId?: string;
  address?: {
    label?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  scheduledDate: string;
  scheduledTimeSlot: string;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateBookingStatusDto {
  status:
    | 'pending'
    | 'confirmed'
    | 'technician_assigned'
    | 'on_the_way'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  note?: string;
}

export interface CancelBookingDto {
  reason?: string;
}

export interface CreateServiceReportDto {
  technicianNotes: string;
  partsReplaced?: string[];
  warrantyUntil?: string;
  ratingGiven?: number;
}
