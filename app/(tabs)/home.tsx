import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import SectionHeader from '../../components/common/SectionHeader';
import SubscriptionCard from '../../components/home/SubscriptionCard';
import ServiceGrid from '../../components/home/ServiceGrid';
import RecentRequestCard from '../../components/home/RecentRequestCard';
import ProtectionCard from '../../components/home/ProtectionCard';
import { categories } from '../../data/categories';
import { Category } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { Booking } from '../../types/booking';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, firstName, fullName, displayAddress } = useUserProfile();
  const [recentBookings, setRecentBookings] = useState<Booking[]>(() =>
    bookingStore.getConfirmedBookings().slice(0, 2)
  );

  const displayName = isLoaded
    ? firstName || fullName || (isSignedIn ? 'User' : 'Guest')
    : '...';

  useEffect(() => {
    if (isSignedIn) {
      bookingService
        .getAllBookings()
        .then((list) => {
          setRecentBookings(list.slice(0, 2));
          bookingStore.setConfirmedBookings(list);
        })
        .catch((e) => console.warn('Home fetch bookings warning:', e));
    }
  }, [isSignedIn]);

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings((list) => {
      setRecentBookings(list.slice(0, 2));
    });
    return unsub;
  }, []);

  const handleSelectCategory = (category: Category) => {
    bookingStore.setCategory(category);
    router.push({
      pathname: '/services/brands',
      params: { categoryId: category.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Header */}
      <View style={styles.topBar}>
        <View style={styles.userGreeting}>
          <Text style={styles.greetingText}>Hello, {displayName} 👋</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/profile/addresses')}
            style={styles.locationRow}
          >
            <Ionicons name="location" size={14} color={Colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {displayAddress}
            </Text>
            <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/profile/notifications')}
          style={styles.notificationBtn}
        >
          <Ionicons name="notifications-outline" size={20} color={Colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Active Membership Banner */}
        <SubscriptionCard
          planName="Zevota Care Plus"
          expiryDate="31 Dec 2026"
          remainingServices={3}
          onPress={() => router.push('/profile/protection')}
          onManagePress={() => router.push('/profile/protection')}
        />

        {/* Explore Services Grid */}
        <SectionHeader
          title="Explore Services"
          subtitle="Select an appliance to view verified repairs"
          actionText="View All"
          showChevron
          onActionPress={() => router.push('/(tabs)/services')}
        />
        <ServiceGrid
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />

        {/* Quick Booking CTA Banner */}
        <View style={styles.quickCtaCard}>
          <View style={styles.quickCtaText}>
            <Text style={styles.quickCtaTitle}>Need Emergency Repair?</Text>
            <Text style={styles.quickCtaSubtitle}>Technician at your door in under 60 mins</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/request')}
            style={styles.bookNowBtn}
          >
            <Text style={styles.bookNowBtnText}>Book Fast</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Service Bookings / Requests */}
        {recentBookings.length > 0 && (
          <>
            <SectionHeader
              title="Recent Bookings"
              subtitle="Track ongoing and past repair jobs"
              actionText="See All"
              showChevron
              onActionPress={() => router.push('/(tabs)/requests')}
            />
            {recentBookings.map((b) => (
              <TouchableOpacity
                key={b.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/bookings/[id]',
                    params: { id: b.id },
                  })
                }
                style={styles.recentBookingCard}
              >
                <View style={styles.recentBookingLeft}>
                  <View style={styles.recentIconBox}>
                    <Ionicons name="construct-outline" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentServiceTitle} numberOfLines={1}>
                      {b.serviceName}
                    </Text>
                    <Text style={styles.recentMeta}>
                      {b.categoryName} • {b.date} ({b.timeSlot})
                    </Text>
                  </View>
                </View>
                <View style={styles.recentStatusBadge}>
                  <Text style={styles.recentStatusText}>{b.status.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* 360 Shield Card */}
        <ProtectionCard onLearnMore={() => router.push('/profile/protection')} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userGreeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    maxWidth: 180,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  quickCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.md,
    ...Elevation.md,
  },
  quickCtaText: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  quickCtaTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  quickCtaSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: '#94A3B8',
  },
  bookNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  bookNowBtnText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.white,
  },
  recentBookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  recentBookingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  recentIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentServiceTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  recentMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recentStatusBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.xs,
  },
  recentStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
});
