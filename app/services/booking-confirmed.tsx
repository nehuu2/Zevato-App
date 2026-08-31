import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import { bookingStore } from '../../store/bookingStore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const lastBooking = bookingStore.getLastConfirmedBooking();

  const bookingId = params.id || lastBooking?.id || 'ZEV-2026-89412';
  const booking = lastBooking || {
    id: bookingId,
    serviceName: 'Power Jet AC Deep Cleaning',
    categoryName: 'Air Conditioner',
    brandName: 'Daikin',
    date: 'Today',
    timeSlot: '02:00 PM - 04:00 PM',
    address: {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Lotus Orchid Heights, Sector 48',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
    },
    paymentMethod: 'UPI Instant Pay',
    totalAmount: 499,
  };

  const handleDone = () => {
    bookingStore.resetBooking();
    router.replace('/(tabs)/home');
  };

  const handleViewBooking = () => {
    router.push({
      pathname: '/bookings/[id]',
      params: { id: bookingId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Success Animated Badge */}
          <View style={styles.successGlow}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark" size={48} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your service appointment has been scheduled and technician assignment is underway.
          </Text>

          {/* Booking ID Pill */}
          <View style={styles.bookingIdPill}>
            <Ionicons name="receipt-outline" size={14} color={Colors.primary} />
            <Text style={styles.bookingIdText}>Booking ID: {bookingId}</Text>
          </View>

          {/* Detailed Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Appliance</Text>
              <Text style={styles.val}>
                {booking.categoryName} {booking.brandName ? `(${booking.brandName})` : ''}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Service Package</Text>
              <Text style={styles.val} numberOfLines={1}>
                {booking.serviceName}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Scheduled Slot</Text>
              <Text style={styles.val}>
                {booking.date}, {booking.timeSlot}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Service Location</Text>
              <Text style={styles.val} numberOfLines={2}>
                {booking.address?.street}, {booking.address?.city}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.val}>{booking.paymentMethod}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalVal}>{formatCurrency(booking.totalAmount)}</Text>
            </View>
          </View>

          {/* Guarantee Assurance */}
          <View style={styles.guaranteeBox}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
            <Text style={styles.guaranteeText}>
              Protected by 30-Day Zevota Care Revisit Warranty.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            title="View Booking Details"
            leftIcon={<Ionicons name="eye-outline" size={18} color={Colors.white} />}
            onPress={handleViewBooking}
            style={styles.primaryBtn}
          />

          <Button
            title="Return to Home"
            variant="outline"
            onPress={handleDone}
            style={styles.secondaryBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  successGlow: {
    width: 104,
    height: 104,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.md,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
    maxWidth: 300,
  },
  bookingIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  bookingIdText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  val: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 200,
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  totalVal: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  guaranteeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  buttonGroup: {
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  primaryBtn: {
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryBtn: {
    width: '100%',
  },
});
