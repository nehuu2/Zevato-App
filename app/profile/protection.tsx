import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

export default function ProtectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Zevota Care Plus" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pro Banner */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={14} color="#FFF" />
            <Text style={styles.badgeText}>MEMBERSHIP ACTIVE</Text>
          </View>
          <Text style={styles.planTitle}>Annual Protection Plan</Text>
          <Text style={styles.planSub}>Valid through 31 December 2026</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLbl}>Free Visits Left</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>₹0</Text>
              <Text style={styles.statLbl}>Inspection Fee</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>10%</Text>
              <Text style={styles.statLbl}>Off Spare Parts</Text>
            </View>
          </View>
        </View>

        {/* Benefits List */}
        <Text style={styles.sectionHeader}>Your Plan Benefits</Text>

        <View style={styles.benefitCard}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>Unlimited Free Diagnostic Visits</Text>
            <Text style={styles.benefitDesc}>Zero call-out fees on any home appliance repair.</Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="speedometer-outline" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>Priority 60-Minute Dispatch</Text>
            <Text style={styles.benefitDesc}>Skip the queue with fast-tracked technician assignment.</Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="pricetag-outline" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>10% Flat Discount on OEM Parts</Text>
            <Text style={styles.benefitDesc}>Genuine manufacturer spares at reduced rates.</Text>
          </View>
        </View>

        <Button
          title="Renew / Upgrade Membership"
          style={styles.renewBtn}
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
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Elevation.md,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  planTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  planSub: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  statLbl: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  benefitCard: {
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
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  benefitDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  renewBtn: {
    marginTop: Spacing.md,
  },
});
