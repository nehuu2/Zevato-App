import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import AccountStats from '../../components/profile/AccountStats';
import { userStore } from '../../store/userStore';
import { authStore } from '../../store/authStore';

export default function ProfileTabScreen() {
  const router = useRouter();
  const user = userStore.getState();

  const handleResetOnboarding = async () => {
    await authStore.resetOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Profile" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          user={user}
          onEditPress={() => router.push('/profile/personal-info')}
        />

        <AccountStats
          completedBookings={14}
          activeRequests={1}
          savedAmount={2450}
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
            badge="2 Saved"
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
            badge="Active"
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
            title="Log Out"
            destructive
            onPress={() => router.replace('/(auth)/login')}
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
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
