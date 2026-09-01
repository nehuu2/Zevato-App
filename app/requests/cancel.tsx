import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { bookingStore } from '../../store/bookingStore';
import { bookingService } from '../../services/bookings';
import { Booking } from '../../types/booking';

const reasons = [
  'Technician arrival delayed',
  'Issue resolved by myself',
  'Price higher than expected',
  'Need to reschedule for another date',
  'Booked by mistake',
  'Other reason',
];

export default function CancelRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking | null>(() =>
    id ? bookingStore.getBookingById(id) || null : null
  );

  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [customFeedback, setCustomFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && !booking) {
      bookingService
        .getBookingById(id)
        .then((b) => setBooking(b))
        .catch((e) => console.warn('Could not fetch booking details for cancel:', e));
    }
  }, [id, booking]);

  const handleConfirmCancel = async () => {
    setLoading(true);
    const reasonToSave =
      selectedReason === 'Other reason' && customFeedback.trim()
        ? customFeedback.trim()
        : selectedReason;

    try {
      if (id) {
        await bookingService.cancelBooking(id, reasonToSave);
        bookingStore.cancelBooking(id, reasonToSave);
      }
      setLoading(false);
      Alert.alert(
        'Booking Cancelled',
        'Your service appointment has been successfully cancelled.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/requests') }]
      );
    } catch (err: any) {
      setLoading(false);
      console.warn('Cancellation failed on backend:', err);
      Alert.alert('Cancellation Error', err.message || 'Failed to cancel booking. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Cancel Booking"
        subtitle={id ? `#${id}` : undefined}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Mini Card */}
        {booking && (
          <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Ionicons name="alert-circle" size={18} color={Colors.danger} />
              <Text style={styles.bookingTitle}>Cancelling Service</Text>
            </View>
            <Text style={styles.bookingService}>{booking.serviceName}</Text>
            <Text style={styles.bookingMeta}>
              {booking.categoryName} • Scheduled for {booking.date} at {booking.timeSlot}
            </Text>
          </View>
        )}

        <Text style={styles.title}>Reason for Cancellation</Text>
        <Text style={styles.subtitle}>
          Please select a reason so we can improve our service:
        </Text>

        <View style={styles.reasonsList}>
          {reasons.map((r) => {
            const isSelected = r === selectedReason;
            return (
              <TouchableOpacity
                key={r}
                activeOpacity={0.8}
                onPress={() => setSelectedReason(r)}
                style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Colors.danger : Colors.borderDark}
                />
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedReason === 'Other reason' && (
          <Input
            placeholder="Please share more details with our support team..."
            multiline
            numberOfLines={3}
            value={customFeedback}
            onChangeText={setCustomFeedback}
          />
        )}

        {/* Cancellation Policy Banner */}
        <View style={styles.policyCard}>
          <Ionicons name="information-circle" size={16} color={Colors.primary} />
          <Text style={styles.policyText}>
            Free cancellation with 100% full refund. No cancellation penalties applied.
          </Text>
        </View>

        <Button
          title="Confirm Cancellation"
          variant="danger"
          loading={loading}
          onPress={handleConfirmCancel}
          style={styles.submitBtn}
        />

        <Button
          title="Keep My Booking"
          variant="ghost"
          onPress={() => router.back()}
          style={styles.keepBtn}
        />
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
  bookingCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  bookingTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.danger,
  },
  bookingService: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  bookingMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  reasonsList: {
    marginBottom: Spacing.sm,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonItemSelected: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  reasonText: {
    fontSize: Typography.fontSize.sm,
  },
  reasonTextSelected: {
    color: Colors.danger,
    fontWeight: '700',
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.md,
  },
  policyText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
  keepBtn: {
    marginTop: Spacing.sm,
  },
});
