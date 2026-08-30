import { UserProfile, Address, PaymentMethod } from '../types/user';

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: 'Flat 402, Lotus Orchid Heights, Sector 48',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    street: 'Tower B, Cyber City, DLF Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    isDefault: false,
  },
];

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'upi',
    title: 'Google Pay / PhonePe UPI',
    subtitle: 'user@okaxis',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'card',
    title: 'HDFC Bank Credit Card',
    subtitle: '•••• 4892 (Visa)',
    isDefault: false,
  },
  {
    id: 'pm-3',
    type: 'cod',
    title: 'Pay on Service (Cash/UPI)',
    subtitle: 'Pay technician after job completion',
    isDefault: false,
  },
];

const defaultProfile: UserProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  addresses: defaultAddresses,
  paymentMethods: defaultPaymentMethods,
  hasProtectionPlan: true,
  memberSince: 'March 2024',
};

let currentUserState: UserProfile = { ...defaultProfile };
const listeners = new Set<(state: UserProfile) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentUserState }));
}

export const userStore = {
  getState: (): UserProfile => ({ ...currentUserState }),

  subscribe: (listener: (state: UserProfile) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    currentUserState = { ...currentUserState, ...updates };
    notify();
  },

  addAddress: (address: Address) => {
    currentUserState = {
      ...currentUserState,
      addresses: [...currentUserState.addresses, address],
    };
    notify();
  },

  removeAddress: (id: string) => {
    currentUserState = {
      ...currentUserState,
      addresses: currentUserState.addresses.filter((a) => a.id !== id),
    };
    notify();
  },

  setDefaultAddress: (id: string) => {
    currentUserState = {
      ...currentUserState,
      addresses: currentUserState.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    notify();
  },
};

export default userStore;
