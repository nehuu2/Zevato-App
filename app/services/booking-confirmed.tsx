import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import { bookingStore } from '../../store/bookingStore';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();

  const handleDone = () => {
    bookingStore.resetBooking();
    router.replace('/(tabs)/home');
  };

  const handleTrack = () => {
    router.replace('/bookings/tracking');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-sharp" size={48} color={Colors.white} />
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your service booking #{Math.floor(10000 + Math.random() * 90000)} has been placed successfully.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Appliance</Text>
              <Text style={styles.val}>{draft.category?.name || 'Air Conditioner'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Service</Text>
              <Text style={styles.val}>{draft.service?.title || 'Standard Service'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Schedule</Text>
              <Text style={styles.val}>{draft.date || 'Today'}, {draft.timeSlot || '02:00 PM'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Service Location</Text>
              <Text style={styles.val} numberOfLines={1}>
                {draft.address?.street || 'Sector 48, Gurugram'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title="Track Technician Live"
            leftIcon={<Ionicons name="navigate-outline" size={18} color={Colors.white} />}
            onPress={handleTrack}
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
    paddingTop: Spacing.xl,
  },
  successIconBox: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.xl,
    maxWidth: 280,
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
    paddingVertical: Spacing.xs + 2,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  val: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 180,
    textAlign: 'right',
  },
  buttonGroup: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  primaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
});
