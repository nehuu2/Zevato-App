import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import BookingProgress from '../../components/tracking/BookingProgress';
import TechnicianCard from '../../components/tracking/TechnicianCard';
import { mockBookings } from '../../data/bookings';
import { bookingStore } from '../../store/bookingStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { Booking } from '../../types/booking';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const foundStoreBooking = bookingStore.getBookingById(id || '');
  const foundMockBooking = mockBookings.find((b) => b.id === id);

  const fallbackBooking: Booking = {
    id: id || 'ZEV-2026-00000',
    serviceId: 'srv-std',
    serviceName: 'Power Jet AC Deep Cleaning',
    categoryName: 'Air Conditioner',
    brandName: 'Daikin',
    selectedOption: {
      id: 'opt-std',
      title: 'Power Jet AC Deep Cleaning',
      description: 'High-pressure deep cleaning and filter disinfection',
      duration: '45 - 60 mins',
      price: 499,
      features: ['2x deeper cleaning', 'Cooling check'],
      included: ['Indoor coil wash', 'Outdoor jet spray'],
      excluded: ['Gas refilling'],
      warrantyDays: 30,
    },
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
    paymentStatus: 'paid',
    totalAmount: 499,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    technician: {
      id: 'tech-101',
      name: 'Rajesh Sharma',
      phone: '+91 98765 12345',
      rating: 4.9,
      completedJobs: 420,
      experienceYears: 6,
    },
  };

  const booking: Booking = foundStoreBooking || foundMockBooking || fallbackBooking;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title={`Booking #${booking.id}`}
        subtitle={booking.serviceName}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Tracker */}
        <BookingProgress status={booking.status} />

        {/* Technician Card if assigned */}
        {booking.technician && (
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
            <Text style={styles.val} numberOfLines={1}>{booking.selectedOption.title}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Scheduled Slot</Text>
            <Text style={styles.val}>{booking.date} at {booking.timeSlot}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.val} numberOfLines={1}>
              {booking.address?.street}, {booking.address?.city}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.val}>{booking.paymentMethod}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalVal}>
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Live Map Tracking"
            leftIcon={<Ionicons name="location" size={18} color={Colors.white} />}
            onPress={() => router.push('/bookings/tracking')}
            style={styles.actionBtn}
          />
          <Button
            title="View Tax Invoice"
            variant="outline"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.primary} />}
            onPress={() => router.push('/bookings/invoice')}
            style={styles.actionBtn}
          />
          <Button
            title="Back to Home"
            variant="ghost"
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.actionBtn}
          />
        </View>
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
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
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
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  actionButtons: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
