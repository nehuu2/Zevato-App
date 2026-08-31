import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import RequestCard from '../../components/requests/RequestCard';
import EmptyState from '../../components/common/EmptyState';
import { bookingStore } from '../../store/bookingStore';
import { Booking } from '../../types/booking';

export default function RequestsIndexScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getConfirmedBookings());

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings((updated) => setBookings(updated));
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="All Bookings & Requests" showBack onBackPress={() => router.back()} />
      <View style={styles.container}>
        <FlatList
          data={bookings}
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
              title="No Bookings Found"
              description="You have no service bookings scheduled yet."
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
    paddingTop: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
