import { useUser } from '@clerk/expo';
import { Address, PaymentMethod, UserProfile, ClerkUserMetadata } from '../types/user';

export interface CompleteProfileParams {
  name?: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  apartment?: string;
}

export interface UseUserProfileReturn {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: ReturnType<typeof useUser>['user'];
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  initials: string;
  addresses: Address[];
  defaultAddress: Address | null;
  displayAddress: string;
  paymentMethods: PaymentMethod[];
  hasProtectionPlan: boolean;
  profileCompleted: boolean;
  isProfileCompleted: boolean;
  memberSince?: string;
  profile: UserProfile;
  updateProfile: (updates: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string | Address;
    addresses?: Address[];
    paymentMethods?: PaymentMethod[];
    hasProtectionPlan?: boolean;
    profileCompleted?: boolean;
  }) => Promise<void>;
  completeProfile: (params: CompleteProfileParams) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  addPaymentMethod: (pm: PaymentMethod) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user, isLoaded, isSignedIn } = useUser();

  const id = user?.id || '';
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName =
    user?.fullName ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') ||
    (isSignedIn ? 'User' : 'Guest');

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  const metadata = (user?.unsafeMetadata || {}) as ClerkUserMetadata;
  const phone = (metadata.phone as string) || user?.primaryPhoneNumber?.phoneNumber || '';
  const avatarUrl = user?.imageUrl || undefined;
  const profileCompleted = Boolean(metadata.profileCompleted);

  // Derive initials
  const initials = (fullName || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U';

  // Addresses from Clerk unsafeMetadata
  let addresses: Address[] = [];
  if (Array.isArray(metadata.addresses)) {
    addresses = metadata.addresses;
  } else if (metadata.address) {
    if (typeof metadata.address === 'string') {
      addresses = [
        {
          id: 'addr-primary',
          label: 'Home',
          street: metadata.address,
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          isDefault: true,
        },
      ];
    } else if (typeof metadata.address === 'object') {
      addresses = [
        {
          id: metadata.address.id || 'addr-primary',
          label: metadata.address.label || 'Home',
          street: metadata.address.street || '',
          apartment: metadata.address.apartment || '',
          city: metadata.address.city || '',
          state: metadata.address.state || '',
          pincode: metadata.address.pincode || '',
          country: metadata.address.country || 'India',
          isDefault: true,
        },
      ];
    }
  }

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;
  const displayAddress = defaultAddress
    ? [defaultAddress.street, defaultAddress.city].filter(Boolean).join(', ')
    : typeof metadata.address === 'string' && metadata.address
    ? metadata.address
    : 'Add your address';

  // Payment methods from Clerk unsafeMetadata
  const paymentMethods: PaymentMethod[] = Array.isArray(metadata.paymentMethods)
    ? metadata.paymentMethods
    : [];

  const hasProtectionPlan = Boolean(metadata.hasProtectionPlan);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : undefined;

  const profile: UserProfile = {
    id,
    name: fullName,
    email,
    phone,
    avatarUrl,
    addresses,
    paymentMethods,
    hasProtectionPlan,
    profileCompleted,
    memberSince,
  };

  const updateProfile = async (updates: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string | Address;
    addresses?: Address[];
    paymentMethods?: PaymentMethod[];
    hasProtectionPlan?: boolean;
    profileCompleted?: boolean;
  }) => {
    if (!user) return;

    let fName = updates.firstName;
    let lName = updates.lastName;

    if (updates.fullName !== undefined) {
      const parts = updates.fullName.trim().split(' ');
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    const currentMetadata = (user.unsafeMetadata || {}) as ClerkUserMetadata;
    const updatedMetadata: ClerkUserMetadata = {
      ...currentMetadata,
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
      ...(updates.address !== undefined ? { address: updates.address } : {}),
      ...(updates.addresses !== undefined ? { addresses: updates.addresses } : {}),
      ...(updates.paymentMethods !== undefined ? { paymentMethods: updates.paymentMethods } : {}),
      ...(updates.hasProtectionPlan !== undefined ? { hasProtectionPlan: updates.hasProtectionPlan } : {}),
      ...(updates.profileCompleted !== undefined ? { profileCompleted: updates.profileCompleted } : {}),
    };

    await user.update({
      ...(fName !== undefined ? { firstName: fName } : {}),
      ...(lName !== undefined ? { lastName: lName } : {}),
      unsafeMetadata: updatedMetadata,
    });
  };

  const completeProfile = async (params: CompleteProfileParams) => {
    if (!user) return;

    const primaryAddr: Address = {
      id: 'addr-primary',
      label: 'Home',
      street: params.street.trim(),
      apartment: params.apartment?.trim(),
      city: params.city.trim(),
      state: params.state.trim(),
      pincode: params.pincode.trim(),
      country: params.country?.trim() || 'India',
      isDefault: true,
    };

    let fName = user.firstName || '';
    let lName = user.lastName || '';
    if (params.name && params.name.trim()) {
      const parts = params.name.trim().split(' ');
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    const currentMetadata = (user.unsafeMetadata || {}) as ClerkUserMetadata;
    const updatedMetadata: ClerkUserMetadata = {
      ...currentMetadata,
      phone: params.phone.trim(),
      profileCompleted: true,
      address: primaryAddr,
      addresses: [primaryAddr],
    };

    await user.update({
      firstName: fName || undefined,
      lastName: lName || undefined,
      unsafeMetadata: updatedMetadata,
    });
  };

  const addAddress = async (newAddress: Address) => {
    const updatedAddresses = [...addresses, newAddress];
    await updateProfile({ addresses: updatedAddresses });
  };

  const setDefaultAddress = async (addrId: string) => {
    const updatedAddresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addrId,
    }));
    await updateProfile({ addresses: updatedAddresses });
  };

  const removeAddress = async (addrId: string) => {
    const updatedAddresses = addresses.filter((a) => a.id !== addrId);
    await updateProfile({ addresses: updatedAddresses });
  };

  const addPaymentMethod = async (pm: PaymentMethod) => {
    const updated = [...paymentMethods, pm];
    await updateProfile({ paymentMethods: updated });
  };

  const removePaymentMethod = async (pmId: string) => {
    const updated = paymentMethods.filter((p) => p.id !== pmId);
    await updateProfile({ paymentMethods: updated });
  };

  const setDefaultPaymentMethod = async (pmId: string) => {
    const updated = paymentMethods.map((p) => ({
      ...p,
      isDefault: p.id === pmId,
    }));
    await updateProfile({ paymentMethods: updated });
  };

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user,
    id,
    fullName,
    firstName,
    lastName,
    email,
    phone,
    avatarUrl,
    initials,
    addresses,
    defaultAddress,
    displayAddress,
    paymentMethods,
    hasProtectionPlan,
    profileCompleted,
    isProfileCompleted: profileCompleted,
    memberSince,
    profile,
    updateProfile,
    completeProfile,
    addAddress,
    setDefaultAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  };
}

export default useUserProfile;
