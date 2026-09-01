import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/expo';
import { Address, PaymentMethod, UserProfile, ClerkUserMetadata } from '../types/user';
import { userService } from '../services/users';

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
  refreshProfile: () => Promise<void>;
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
  const [dbAddresses, setDbAddresses] = useState<Address[]>([]);
  const [dbProfile, setDbProfile] = useState<Partial<UserProfile> | null>(null);

  const id = user?.id || '';
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName =
    dbProfile?.name ||
    user?.fullName ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : '') ||
    (isSignedIn ? 'User' : 'Guest');

  const email =
    dbProfile?.email ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    '';

  const metadata = (user?.unsafeMetadata || {}) as ClerkUserMetadata;
  const phone = (dbProfile?.phone as string) || (metadata.phone as string) || user?.primaryPhoneNumber?.phoneNumber || '';
  const avatarUrl = dbProfile?.avatarUrl || user?.imageUrl || undefined;
  const profileCompleted = Boolean(dbProfile?.profileCompleted ?? metadata.profileCompleted);

  // Derive initials
  const initials = (fullName || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'U';

  // Addresses priority: Database addresses > Clerk metadata addresses
  let addresses: Address[] = dbAddresses;
  if (addresses.length === 0) {
    if (Array.isArray(metadata.addresses)) {
      addresses = metadata.addresses;
    } else if (metadata.address) {
      if (typeof metadata.address === 'string') {
        addresses = [
          {
            id: 'addr-primary',
            label: 'Home',
            street: metadata.address,
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122001',
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

  const hasProtectionPlan = Boolean(dbProfile?.hasProtectionPlan ?? metadata.hasProtectionPlan);
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

  // Sync profile & addresses from backend on sign-in
  const fetchBackendData = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const [userRes, addrRes] = await Promise.allSettled([
        userService.getProfile(),
        userService.getAddresses(),
      ]);

      if (userRes.status === 'fulfilled' && userRes.value) {
        setDbProfile(userRes.value);
        if (userRes.value.addresses && userRes.value.addresses.length > 0) {
          setDbAddresses(userRes.value.addresses);
        }
      }

      if (addrRes.status === 'fulfilled' && Array.isArray(addrRes.value)) {
        setDbAddresses(addrRes.value);
      }
    } catch (e) {
      console.warn('Backend sync failed, falling back to local session:', e);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchBackendData();
    }
  }, [isSignedIn, fetchBackendData]);

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

    // Update Clerk
    await user.update({
      ...(fName !== undefined ? { firstName: fName } : {}),
      ...(lName !== undefined ? { lastName: lName } : {}),
      unsafeMetadata: updatedMetadata,
    });

    // Update Backend Database
    try {
      const updatedDbUser = await userService.updateProfile({
        name: updates.fullName,
        phone: updates.phone,
        profileCompleted: updates.profileCompleted,
      });
      if (updatedDbUser) {
        setDbProfile(updatedDbUser);
      }
    } catch (err) {
      console.warn('Backend profile update sync warning:', err);
    }
  };

  const completeProfile = async (params: CompleteProfileParams) => {
    if (!user) return;

    const primaryAddr: Address = {
      id: 'addr-' + Date.now(),
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

    // Sync to Backend Database
    try {
      await userService.updateProfile({
        name: params.name ? params.name.trim() : `${fName} ${lName}`.trim(),
        phone: params.phone.trim(),
        profileCompleted: true,
      });
      const createdAddr = await userService.addAddress(primaryAddr);
      setDbAddresses([createdAddr]);
    } catch (e) {
      console.warn('Backend completeProfile sync warning:', e);
    }
  };

  const addAddress = async (newAddress: Address) => {
    try {
      const created = await userService.addAddress(newAddress);
      setDbAddresses((prev) => [created, ...prev]);
    } catch (e) {
      console.warn('Backend addAddress error, saving locally:', e);
      setDbAddresses((prev) => [newAddress, ...prev]);
    }

    const updatedAddresses = [...addresses, newAddress];
    await updateProfile({ addresses: updatedAddresses });
  };

  const setDefaultAddress = async (addrId: string) => {
    try {
      await userService.setDefaultAddress(addrId);
      setDbAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === addrId }))
      );
    } catch (e) {
      console.warn('Backend setDefaultAddress error:', e);
    }

    const updatedAddresses = addresses.map((a) => ({
      ...a,
      isDefault: a.id === addrId,
    }));
    await updateProfile({ addresses: updatedAddresses });
  };

  const removeAddress = async (addrId: string) => {
    try {
      await userService.deleteAddress(addrId);
      setDbAddresses((prev) => prev.filter((a) => a.id !== addrId));
    } catch (e) {
      console.warn('Backend removeAddress error:', e);
    }

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
    refreshProfile: fetchBackendData,
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
