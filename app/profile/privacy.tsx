import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Privacy Policy" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.bodyText}>
          We collect your name, phone number, email address, and service delivery addresses solely to facilitate doorstep technician scheduling and emergency repairs.
        </Text>

        <Text style={styles.sectionTitle}>2. Location Permissions</Text>
        <Text style={styles.bodyText}>
          Real-time location data is used exclusively during active bookings to compute accurate technician travel estimates and route optimization.
        </Text>

        <Text style={styles.sectionTitle}>3. Payment Security</Text>
        <Text style={styles.bodyText}>
          All transactions are processed through RBI-compliant payment gateways with 256-bit encryption. We never store raw credit/debit card numbers on our servers.
        </Text>

        <Text style={styles.sectionTitle}>4. Contact</Text>
        <Text style={styles.bodyText}>
          For data deletion requests, contact privacy@zevotacare.com.
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
