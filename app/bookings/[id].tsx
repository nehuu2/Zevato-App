import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
import { formatCurrency } from '../../utils/formatCurrency';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={`Booking #${booking.id}`}
        subtitle={booking.serviceName}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
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
            <Text style={styles.val}>{booking.categoryName} ({booking.brandName})</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Service Type</Text>
            <Text style={styles.val}>{booking.selectedOption.title}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Scheduled Slot</Text>
            <Text style={styles.val}>{booking.date} at {booking.timeSlot}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={[styles.val, styles.priceVal]}>
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
            title="View Invoice"
            variant="outline"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.primary} />}
            onPress={() => router.push('/bookings/invoice')}
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
  label: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
  },
  val: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
  },
  priceVal: {
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
