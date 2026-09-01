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
import TechnicianCard from '../../components/tracking/TechnicianCard';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { formatCurrency } from '../../utils/formatCurrency';
import { Booking } from '../../types/booking';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | undefined>(() =>
    bookingStore.getBookingById(id || '')
  );
  const [loading, setLoading] = useState<boolean>(!booking);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingById(id);
      setBooking(data);
      bookingStore.addConfirmedBooking(data);
    } catch (err: any) {
      console.warn(`Failed to fetch booking #${id}:`, err);
      // If cached in store, keep it
      const cached = bookingStore.getBookingById(id);
      if (cached) {
        setBooking(cached);
      } else {
        setError(err.message || `We couldn't locate booking #${id}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  useEffect(() => {
    const unsub = bookingStore.subscribeBookings(() => {
      const updated = bookingStore.getBookingById(id || '');
      if (updated) {
        setBooking(updated);
      }
    });
    return unsub;
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Booking Details" showBack onBackPress={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!booking || error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Booking Details" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="alert-circle-outline"
            title="Booking Not Found"
            description={error || `We couldn't locate booking #${id || 'unknown'}. It may belong to another account or have been archived.`}
            actionTitle="View My Bookings"
            onActionPress={() => router.replace('/(tabs)/requests')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
        return { bg: Colors.successLight, text: Colors.success, label: 'Completed' };
      case 'cancelled':
        return { bg: Colors.dangerLight, text: Colors.danger, label: 'Cancelled' };
      case 'in_progress':
        return { bg: Colors.warningLight, text: '#B45309', label: 'In Progress' };
      case 'on_the_way':
        return { bg: Colors.infoLight, text: Colors.info, label: 'Technician En Route' };
      case 'technician_assigned':
        return { bg: Colors.primaryLight, text: Colors.primaryDark, label: 'Technician Assigned' };
      case 'confirmed':
      default:
        return { bg: Colors.primaryLight, text: Colors.primary, label: 'Confirmed' };
    }
  };

  const statusBadge = getStatusBadge(booking.status);
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title={`Booking #${booking.id}`}
        subtitle={booking.serviceName}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Header Banner */}
        <View style={styles.statusBanner}>
          <View>
            <Text style={styles.statusBannerTitle}>Booking Status</Text>
            <Text style={styles.statusBannerDate}>
              Created on {new Date(booking.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusBadge.text }]}>
              {statusBadge.label}
            </Text>
          </View>
        </View>

        {/* Progress Tracker */}
        <BookingProgress status={booking.status} />

        {/* Technician Card if assigned & not cancelled */}
        {booking.technician && !isCancelled && (
          <TechnicianCard
            technician={booking.technician}
            onCallPress={() => {}}
            onChatPress={() => {}}
          />
        )}

        {/* Booking Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Appliance</Text>
            <Text style={styles.val}>
              {booking.categoryName} {booking.brandName ? `(${booking.brandName})` : ''}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Package</Text>
            <Text style={styles.val} numberOfLines={1}>{booking.selectedOption?.title || booking.serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Scheduled Slot</Text>
            <Text style={styles.val}>{booking.date} at {booking.timeSlot}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.val} numberOfLines={2}>
              {booking.address?.street}, {booking.address?.city}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.val}>{booking.paymentMethod}</Text>
          </View>
          {booking.cancellationReason ? (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: Colors.danger }]}>Cancellation Reason</Text>
              <Text style={[styles.val, { color: Colors.danger }]}>{booking.cancellationReason}</Text>
            </View>
          ) : null}
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Action Buttons based on status */}
        <View style={styles.actionButtons}>
          {!isCompleted && !isCancelled && (
            <>
              <Button
                title="Live Map Tracking"
                leftIcon={<Ionicons name="location" size={18} color={Colors.white} />}
                onPress={() => router.push({
                  pathname: '/bookings/tracking',
                  params: { id: booking.id },
                })}
                style={styles.actionBtn}
              />
              <Button
                title="Cancel Booking"
                variant="danger"
                onPress={() => router.push({
                  pathname: '/requests/cancel',
                  params: { id: booking.id },
                })}
                style={styles.actionBtn}
              />
            </>
          )}

          {isCompleted && (
            <>
              <Button
                title="View Service Completion Report"
                leftIcon={<Ionicons name="document-text" size={18} color={Colors.white} />}
                onPress={() => router.push({
                  pathname: '/bookings/completed',
                  params: { id: booking.id },
                })}
                style={styles.actionBtn}
              />
              <Button
                title="View Tax Invoice"
                variant="outline"
                leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.primary} />}
                onPress={() => router.push({
                  pathname: '/bookings/invoice',
                  params: { id: booking.id },
                })}
                style={styles.actionBtn}
              />
            </>
          )}

          {isCancelled && (
            <Button
              title="Book Another Service"
              leftIcon={<Ionicons name="add-circle-outline" size={18} color={Colors.white} />}
              onPress={() => router.push('/(tabs)/services')}
              style={styles.actionBtn}
            />
          )}

          <Button
            title="Back to My Bookings"
            variant="ghost"
            onPress={() => router.replace('/(tabs)/requests')}
            style={styles.actionBtn}
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
  content: {
    padding: Spacing.base,
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
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  statusBannerTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBannerDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
    ...Elevation.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
  },
  val: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 220,
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  totalVal: {
    fontSize: Typography.fontSize.base,
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  actionButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
