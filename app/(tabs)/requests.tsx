import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import RequestTabs, { RequestTabType, TabItem } from '../../components/requests/RequestTabs';
import RequestCard from '../../components/requests/RequestCard';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { Booking } from '../../types/booking';

export default function RequestsTabScreen() {
  const router = useRouter();
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
      // Keep cached store bookings if available
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

  const activeCount = bookings.filter(
    (b) =>
      b.status === 'confirmed' ||
      b.status === 'technician_assigned' ||
      b.status === 'on_the_way' ||
      b.status === 'in_progress'
  ).length;

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const tabItems: TabItem[] = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'active', label: 'Active', count: activeCount },
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="My Bookings & Requests" />
      <View style={styles.container}>
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
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
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xs,
  },
});
