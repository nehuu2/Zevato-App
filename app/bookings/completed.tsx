import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ServiceReport from '../../components/tracking/ServiceReport';

export default function BookingCompletedScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Service Completed" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBox}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-done" size={36} color={Colors.white} />
          </View>
          <Text style={styles.title}>Service Successfully Completed!</Text>
          <Text style={styles.subtitle}>
            Your AC Power Jet Deep Cleaning has been completed with a 30-day warranty.
          </Text>
        </View>

        {/* Rating prompt */}
        <View style={styles.rateCard}>
          <Text style={styles.rateTitle}>Rate Technician Performance</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
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

        {/* Service Report Card */}
        <ServiceReport
          technicianNotes="Inspected indoor coil, deep jet foam cleaned filters & drainage tray. Amp load 3.8A steady. Guaranteed cooling restored."
          partsReplaced={['Drain pipe seal rubber']}
          warrantyUntil="30 Sep 2026"
          ratingGiven={rating}
        />

        <View style={styles.actionButtons}>
          <Button
            title="Download GST Invoice"
            variant="outline"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.primary} />}
            onPress={() => router.push('/bookings/invoice')}
          />
          <Button
            title="Back to Home"
            onPress={() => router.replace('/(tabs)/home')}
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
    paddingBottom: Spacing.xl,
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
    maxWidth: 280,
  },
  rateCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  rateTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
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
