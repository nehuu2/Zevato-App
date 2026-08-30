export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  title: string;
  subtitle?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  hasProtectionPlan?: boolean;
  memberSince?: string;
}
