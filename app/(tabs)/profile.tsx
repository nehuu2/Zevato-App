import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import AccountStats from '../../components/profile/AccountStats';
import { authStore } from '../../store/authStore';
import { bookingStore } from '../../store/bookingStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Booking } from '../../types/booking';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, profile, addresses, hasProtectionPlan } = useUserProfile();
  const { signOut } = useClerk();

  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getConfirmedBookings());

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings((updated) => {
      setBookings(updated);
    });
    return unsub;
  }, []);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const activeCount = bookings.filter(
    (b) =>
      b.status === 'confirmed' ||
      b.status === 'technician_assigned' ||
      b.status === 'on_the_way' ||
      b.status === 'in_progress'
  ).length;
  const savings = completedCount * 350; // Dynamic savings computation based on completed visits

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            if (isSignedIn) {
              await signOut();
            }
            await authStore.logout();
          } catch (e) {
            console.warn('Logout error:', e);
          }
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    await authStore.resetOnboarding();
    if (isSignedIn) {
      await signOut();
    }
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Profile" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Guest Banner if not signed in with Clerk */}
        {isLoaded && !isSignedIn ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/login')}
            style={styles.guestBanner}
          >
            <View style={styles.guestBannerLeft}>
              <View style={styles.guestIconCircle}>
                <Ionicons name="person-add" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.guestBannerTitle}>Sign In with Google or Email</Text>
                <Text style={styles.guestBannerSub}>Save addresses, sync orders & get warranty</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}

        <ProfileHeader
          user={profile}
          onEditPress={() => router.push('/profile/personal-info')}
        />

        <AccountStats
          completedBookings={completedCount}
          activeRequests={activeCount}
          savedAmount={savings}
        />

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Name, email, phone number"
            onPress={() => router.push('/profile/personal-info')}
          />
          <ProfileMenuItem
            icon="location-outline"
            title="Saved Addresses"
            subtitle="Home, office & other delivery spots"
            badge={addresses.length > 0 ? `${addresses.length} Saved` : undefined}
            onPress={() => router.push('/profile/addresses')}
          />
          <ProfileMenuItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Saved cards, UPI, wallets"
            onPress={() => router.push('/profile/payment-methods')}
          />
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            title="Zevota Care Plus Protection"
            subtitle="Manage your home appliance plan"
            badge={hasProtectionPlan ? 'Active' : undefined}
            badgeColor={Colors.success}
            onPress={() => router.push('/profile/protection')}
          />
          <ProfileMenuItem
            icon="receipt-outline"
            title="Invoices & Service Bills"
            subtitle="Download GST tax invoices"
            onPress={() => router.push('/profile/invoices')}
          />
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon="gift-outline"
            title="Refer & Earn ₹500"
            subtitle="Invite friends & get repair credits"
            onPress={() => router.push('/profile/refer-earn')}
          />
          <ProfileMenuItem
            icon="notifications-outline"
            title="Notification Settings"
            subtitle="Reminders & service updates"
            onPress={() => router.push('/profile/notifications')}
          />
          <ProfileMenuItem
            icon="help-buoy-outline"
            title="Help Center & FAQs"
            subtitle="Get answers to common queries"
            onPress={() => router.push('/profile/help-center')}
          />
          <ProfileMenuItem
            icon="chatbubbles-outline"
            title="Contact Support"
            subtitle="24/7 dedicated assistance"
            onPress={() => router.push('/profile/contact-support')}
          />
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon="information-circle-outline"
            title="About Zevota Care"
            onPress={() => router.push('/profile/about')}
          />
          <ProfileMenuItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => router.push('/profile/privacy')}
          />
          <ProfileMenuItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => router.push('/profile/terms')}
          />
          <ProfileMenuItem
            icon="refresh-outline"
            title="Restart Onboarding (Dev Tool)"
            subtitle="Reset onboarding state and test flow"
            onPress={handleResetOnboarding}
          />
          <ProfileMenuItem
            icon="log-out-outline"
            title={isSignedIn ? 'Log Out' : 'Sign In'}
            destructive={isSignedIn}
            onPress={isSignedIn ? handleLogout : () => router.push('/(auth)/login')}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    ...Elevation.sm,
  },
  guestBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  guestIconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBannerTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  guestBannerSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
