import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import RequestTabs, { RequestTabType, TabItem } from '../../components/requests/RequestTabs';
import RequestCard from '../../components/requests/RequestCard';
import { bookingStore } from '../../store/bookingStore';
import { Booking } from '../../types/booking';

export default function RequestsTabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RequestTabType>('all');
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getConfirmedBookings());

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings((updatedList) => {
      setBookings(updatedList);
    });
    return unsub;
  }, []);

  const activeCount = bookings.filter((b) =>
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

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RequestCard
              booking={item}
              onPress={() => router.push({
                pathname: '/bookings/[id]',
                params: { id: item.id },
              })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No Bookings Found"
              description="You have no service bookings in this tab."
              actionTitle="Book a Service"
              onActionPress={() => router.push('/(tabs)/services')}
            />
          }
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xs,
  },
});
