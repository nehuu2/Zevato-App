import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import BookingStepper from '../../components/booking/BookingStepper';
import DatePicker, { DateOption } from '../../components/booking/DatePicker';
import TimeSlot, { TimeSlotOption } from '../../components/booking/TimeSlot';
import { bookingStore } from '../../store/bookingStore';

const sampleDates: DateOption[] = [
  { id: 'd-1', dayName: 'Today', dateStr: '30 Aug', isToday: true },
  { id: 'd-2', dayName: 'Mon', dateStr: '31 Aug' },
  { id: 'd-3', dayName: 'Tue', dateStr: '1 Sep' },
  { id: 'd-4', dayName: 'Wed', dateStr: '2 Sep' },
  { id: 'd-5', dayName: 'Thu', dateStr: '3 Sep' },
  { id: 'd-6', dayName: 'Fri', dateStr: '4 Sep' },
];

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
  const [selectedDate, setSelectedDate] = useState<DateOption>(sampleDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption>(sampleSlots[2]);

  const handleNext = () => {
    bookingStore.setSchedule(
      `${selectedDate.dayName}, ${selectedDate.dateStr}`,
      selectedSlot.time
    );
    router.push('/services/address');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Schedule Visit" showBack onBackPress={() => router.back()} />
      <BookingStepper currentStep={2} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Select Preferred Date</Text>
        <DatePicker
          dates={sampleDates}
          selectedDateId={selectedDate.id}
          onSelectDate={setSelectedDate}
        />

        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
          Select Time Slot
        </Text>
        <TimeSlot
          slots={sampleSlots}
          selectedSlotId={selectedSlot.id}
          onSelectSlot={setSelectedSlot}
        />

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>⚡ 60-Minute Technician Arrival Window</Text>
          <Text style={styles.tipDesc}>
            Our certified technician will call you 15 minutes before reaching your location.
          </Text>
        </View>

        <Button
          title="Proceed to Address"
          onPress={handleNext}
          style={styles.submitBtn}
        />
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
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  tipCard: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tipTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
