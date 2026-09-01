import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import EmptyState from '../../components/common/EmptyState';
import RequestTabs, { RequestTabType, TabItem } from '../../components/requests/RequestTabs';
import RequestCard from '../../components/requests/RequestCard';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { Booking } from '../../types/booking';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function RequestsTabScreen() {
  const router = useRouter();
  const { avatarUrl, initials } = useUserProfile();
  const [activeTab, setActiveTab] = useState<RequestTabType>('all');
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getConfirmedBookings());
  const [loading, setLoading] = useState<boolean>(bookings.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    } else if (bookings.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const list = await bookingService.getAllBookings();
      setBookings(list);
      bookingStore.setConfirmedBookings(list);
    } catch (err: any) {
      console.warn('Failed to load bookings from backend:', err);
      setError('Unable to load bookings. Please check your connection.');
      setBookings(bookingStore.getConfirmedBookings());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [bookings.length]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings((updatedList) => {
      setBookings(updatedList);
    });
    return unsub;
  }, []);

  const inProgressCount = bookings.filter(
    (b) =>
      b.status === 'confirmed' ||
      b.status === 'technician_assigned' ||
      b.status === 'on_the_way' ||
      b.status === 'in_progress'
  ).length;

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const tabItems: TabItem[] = [
    { id: 'all', label: 'All Requests', count: bookings.length },
    { id: 'active', label: 'In Progress', count: inProgressCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
  ];

  const filtered = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return (
        b.status === 'confirmed' ||
        b.status === 'technician_assigned' ||
        b.status === 'on_the_way' ||
        b.status === 'in_progress'
      );
    }
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const renderBottomInfoSections = () => (
    <View style={styles.bottomSectionsContainer}>
      {/* 1. Need Help Card */}
      <View style={styles.helpCard}>
        <View style={styles.helpCardContent}>
          <View style={styles.helpIconCircle}>
            <Ionicons name="headset" size={20} color="#1D4ED8" />
          </View>
          <View style={styles.helpTextCol}>
            <Text style={styles.helpTitle}>Need help with a request?</Text>
            <Text style={styles.helpSubtitle}>
              Our support team is available 24/7 to resolve appliance queries or reschedule visits.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profile/contact-support')}
          style={styles.helpActionBtn}
        >
          <Ionicons name="headset-outline" size={14} color="#1D4ED8" />
          <Text style={styles.helpActionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Protection Card */}
      <View style={styles.protectionCard}>
        <View style={styles.protectionCardContent}>
          <View style={styles.protectionIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#15803D" />
          </View>
          <View style={styles.protectionTextCol}>
            <Text style={styles.protectionTitle}>Zevota Care Protection</Text>
            <Text style={styles.protectionSubtitle}>
              Get priority technician dispatch, zero visit fees, and extended warranty on all appliances.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profile/protection')}
          style={styles.protectionActionBtn}
        >
          <Ionicons name="shield-checkmark-outline" size={14} color="#15803D" />
          <Text style={styles.protectionActionText}>Explore Plans</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* Row 1: Logo Wordmark + Bell & Profile Avatar */}
        <View style={styles.headerTopRow}>
          {/* Logo Wordmark */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Zevota</Text>
            <Text style={styles.logoSubText}>CARE</Text>
          </View>

          {/* Right Icons: Notification Bell & Profile Avatar */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/profile/notifications')}
              style={styles.bellButton}
            >
              <Ionicons name="notifications-outline" size={22} color="#1E293B" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarButton}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials || 'U'}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Page Title & Subtitle */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>My Requests</Text>
          <Text style={styles.pageSubtitle}>
            Track and manage all your service requests
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.container}>
        {/* Filter Tabs */}
        <RequestTabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your bookings...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchBookings(true)}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            renderItem={({ item }) => (
              <RequestCard
                booking={item}
                onPress={() =>
                  router.push({
                    pathname: '/bookings/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <EmptyState
                icon="calendar-outline"
                title="No Bookings Found"
                description={
                  error ||
                  (activeTab === 'all'
                    ? 'You have not booked any appliance services yet.'
                    : `You have no ${activeTab} service bookings.`)
                }
                actionTitle="Book a Service"
                onActionPress={() => router.push('/(tabs)/services')}
              />
            }
            ListFooterComponent={renderBottomInfoSections}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  logoSubText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 3,
    marginTop: -3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  pageTitleContainer: {
    marginTop: Spacing.sm + 2,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: Spacing.base,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl * 2,
    paddingTop: Spacing.xs,
  },
  bottomSectionsContainer: {
    marginTop: Spacing.md,
    gap: 12,
  },
  helpCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  helpCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  helpIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTextCol: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  helpSubtitle: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 3,
    lineHeight: 17,
  },
  helpActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: BorderRadius.md,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  helpActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  protectionCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  protectionCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  protectionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  protectionTextCol: {
    flex: 1,
  },
  protectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532D',
  },
  protectionSubtitle: {
    fontSize: 12,
    color: '#16A34A',
    marginTop: 3,
    lineHeight: 17,
  },
  protectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    borderRadius: BorderRadius.md,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  protectionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
