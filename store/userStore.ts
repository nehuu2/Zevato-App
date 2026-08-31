import { UserProfile, Address, PaymentMethod } from '../types/user';

const emptyProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatarUrl: undefined,
  addresses: [],
  paymentMethods: [],
  hasProtectionPlan: false,
  memberSince: undefined,
};

let currentUserState: UserProfile = { ...emptyProfile };
const listeners = new Set<(state: UserProfile) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...currentUserState }));
}

export const userStore = {
  getState: (): UserProfile => ({ ...currentUserState }),

  subscribe: (listener: (state: UserProfile) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setProfile: (profile: UserProfile) => {
    currentUserState = { ...profile };
    notify();
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

  clear: () => {
    currentUserState = { ...emptyProfile };
    notify();
  },
};

export default userStore;
