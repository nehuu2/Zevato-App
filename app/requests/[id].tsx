import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import BookingProgress from '../../components/tracking/BookingProgress';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { Booking } from '../../types/booking';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(() => (id ? bookingStore.getBookingById(id) || null : null));
  const [loading, setLoading] = useState<boolean>(!booking);
  const [error, setError] = useState<string | null>(null);

  // If this ID exists as a confirmed booking, route immediately to /bookings/[id]
  useEffect(() => {
    if (booking) {
      router.replace({
        pathname: '/bookings/[id]',
        params: { id: booking.id },
      });
    }
  }, [booking, router]);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingById(id);
      setBooking(data);
      router.replace({
        pathname: '/bookings/[id]',
        params: { id: data.id },
      });
    } catch (err: any) {
      console.warn(`Could not locate booking #${id}:`, err);
      setError(`Booking #${id} not found on server.`);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!booking) {
      fetchBooking();
    }
  }, [booking, fetchBooking]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Service Request" showBack onBackPress={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching request details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Service Request" showBack onBackPress={() => router.back()} />
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="alert-circle-outline"
          title="Request Not Found"
          description={error || `We couldn't locate request #${id || 'unknown'}.`}
          actionTitle="View My Bookings"
          onActionPress={() => router.replace('/(tabs)/requests')}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});
