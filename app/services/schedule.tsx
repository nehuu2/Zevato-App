import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import BookingStepper from '../../components/booking/BookingStepper';
import DatePicker, { DateOption } from '../../components/booking/DatePicker';
import TimeSlot, { TimeSlotOption } from '../../components/booking/TimeSlot';
import { bookingStore } from '../../store/bookingStore';

// Generate dynamic upcoming dates
const getUpcomingDates = (): DateOption[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result: DateOption[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
    const dateStr = `${d.getDate()} ${months[d.getMonth()]}`;
    result.push({
      id: `d-${i}`,
      dayName,
      dateStr,
      isToday: i === 0,
      fullDate: `${dayName}, ${dateStr} ${d.getFullYear()}`,
    });
  }
  return result;
};

const sampleSlots: TimeSlotOption[] = [
  { id: 's-1', time: '09:00 AM - 11:00 AM', available: true, period: 'morning' },
  { id: 's-2', time: '11:00 AM - 01:00 PM', available: true, period: 'morning' },
  { id: 's-3', time: '02:00 PM - 04:00 PM', available: true, period: 'afternoon' },
  { id: 's-4', time: '04:00 PM - 06:00 PM', available: true, period: 'afternoon' },
  { id: 's-5', time: '06:00 PM - 08:00 PM', available: true, period: 'evening' },
  { id: 's-6', time: '08:00 PM - 10:00 PM', available: false, period: 'evening' },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const upcomingDates = getUpcomingDates();

  const [selectedDate, setSelectedDate] = useState<DateOption>(upcomingDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption | null>(sampleSlots[2]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedDate) {
      setValidationError('Please select a visit date.');
      return;
    }
    if (!selectedSlot) {
      setValidationError('Please select a preferred time slot.');
      return;
    }

    setValidationError(null);
    bookingStore.setSchedule(
      `${selectedDate.dayName}, ${selectedDate.dateStr}`,
      selectedSlot.time
    );
    router.push('/services/address');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Schedule Visit"
        subtitle={draft.service?.title || draft.category?.name || 'Service Appointment'}
        showBack
        onBackPress={() => router.back()}
      />
      <BookingStepper currentStep={2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selected Service Package Mini Banner */}
        {draft.service && (
          <View style={styles.servicePill}>
            <View style={styles.serviceIconCircle}>
              <Ionicons name="construct" size={16} color={Colors.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName} numberOfLines={1}>{draft.service.title}</Text>
              <Text style={styles.serviceDetails}>
                {draft.category?.name || 'Appliance'} • {draft.service.duration}
              </Text>
            </View>
            <Text style={styles.servicePrice}>₹{draft.service.price}</Text>
          </View>
        )}

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>1. Select Preferred Date</Text>
        <DatePicker
          dates={upcomingDates}
          selectedDateId={selectedDate.id}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setValidationError(null);
          }}
        />

        {/* Time Slot Selection */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>
          2. Select Arrival Time Window
        </Text>
        <TimeSlot
          slots={sampleSlots}
          selectedSlotId={selectedSlot?.id || ''}
          onSelectSlot={(s) => {
            setSelectedSlot(s);
            setValidationError(null);
          }}
        />

        {/* Validation Error message if any */}
        {validationError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>{validationError}</Text>
          </View>
        ) : null}

        {/* Arrival Promise Tip Card */}
        <View style={styles.tipCard}>
          <Ionicons name="flash" size={18} color={Colors.primary} />
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>60-Minute Arrival Assurance</Text>
            <Text style={styles.tipDesc}>
              Technician calls 15 minutes before reaching. Reschedule anytime with zero penalty.
            </Text>
          </View>
        </View>

        <Button
          title="Proceed to Address"
          onPress={handleNext}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
          style={styles.submitBtn}
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
  scrollContent: {
    padding: Spacing.base,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  serviceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  serviceDetails: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  servicePrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.primaryDark,
    paddingLeft: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
