import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Terms of Service" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.bodyText}>
          By registering with or using Zevota Care, you agree to these Terms of Service and our Quality Guarantee Policies.
        </Text>

        <Text style={styles.sectionTitle}>2. 30-Day Revisit Warranty</Text>
        <Text style={styles.bodyText}>
          All appliance repairs performed through the platform include a complimentary 30-day revisit warranty covering the same fault and diagnosed problem. Warranty does not cover physical tampering or third-party interventions after service.
        </Text>

        <Text style={styles.sectionTitle}>3. Spare Parts</Text>
        <Text style={styles.bodyText}>
          Spare parts installed are genuine OEM components accompanied by manufacturer or vendor warranty cards.
        </Text>

        <Text style={styles.sectionTitle}>4. Cancellation Policy</Text>
        <Text style={styles.bodyText}>
          Bookings may be cancelled at no penalty up to 60 minutes before the scheduled time slot.
        </Text>
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
    backgroundColor: Colors.white,
    margin: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
});
