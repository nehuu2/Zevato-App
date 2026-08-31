import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ServiceReport from '../../components/tracking/ServiceReport';
import { bookingStore } from '../../store/bookingStore';
import { mockBookings } from '../../data/bookings';
import { Booking } from '../../types/booking';

export default function BookingCompletedScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(5);

  const booking: Booking = bookingStore.getBookingById(id || '') || mockBookings[0];

  const handleRating = (stars: number) => {
    setRating(stars);
    Alert.alert('Rating Submitted', `Thank you for rating ${booking.technician?.name || 'our technician'} ${stars} stars!`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Service Completed"
        subtitle={`Booking #${booking.id}`}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Hero Badge */}
        <View style={styles.heroBox}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-done" size={36} color={Colors.white} />
          </View>
          <Text style={styles.title}>Service Successfully Completed!</Text>
          <Text style={styles.subtitle}>
            Your {booking.serviceName} has been completed and verified with our 30-day rework warranty.
          </Text>
        </View>

        {/* Rating Prompt */}
        <View style={styles.rateCard}>
          <Text style={styles.rateTitle}>Rate Technician Performance</Text>
          <Text style={styles.rateSubtitle}>
            How was your experience with {booking.technician?.name || 'our technician'}?
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color="#D97706"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Completion Report Card */}
        <ServiceReport
          technicianNotes={booking.serviceReport?.technicianNotes || `Inspected ${booking.categoryName} (${booking.brandName || 'System'}). Deep cleaned coils & filters, inspected electrical connections, verified normal operating current.`}
          partsReplaced={booking.serviceReport?.partsReplaced || ['Drain Pipe Seal Ring']}
          warrantyUntil="30 Days from today"
          ratingGiven={rating}
        />

        <View style={styles.actionButtons}>
          <Button
            title="View Tax Invoice"
            variant="outline"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.primary} />}
            onPress={() => router.push({
              pathname: '/bookings/invoice',
              params: { id: booking.id },
            })}
          />
          <Button
            title="Back to Home"
            onPress={() => router.replace('/(tabs)/home')}
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
  heroBox: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  rateCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  rateTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  rateSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
