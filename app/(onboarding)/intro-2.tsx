import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

export default function Intro2Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar with Back & Skip */}
        <View style={styles.topBar}>
          <BackButton onPress={() => router.back()} />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>STEP 2 OF 3</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(onboarding)/intro-3')}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Illustration Card */}
        <View style={styles.illustrationSection}>
          <View style={styles.illustrationCard}>
            <View style={styles.circleGraphic}>
              <Ionicons name="pricetag" size={54} color="#059669" />
            </View>

            {/* Floating feature pills */}
            <View style={styles.floatingBadgeTop}>
              <Ionicons name="receipt-outline" size={16} color={Colors.primary} />
              <Text style={styles.badgeText}>Fixed Upfront Rate Cards</Text>
            </View>

            <View style={styles.floatingBadgeBottom}>
              <Ionicons name="hardware-chip-outline" size={16} color="#059669" />
              <Text style={styles.badgeText}>100% Genuine OEM Spares</Text>
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.contentSection}>
          {/* Dot Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Transparent Pricing with Zero Hidden Costs</Text>
          <Text style={styles.description}>
            Know the exact price before the technician starts. Rate cards with manufacturer-grade parts and itemized invoices.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              title="Continue"
              onPress={() => router.push('/(onboarding)/intro-3')}
              rightIcon={<Ionicons name="chevron-forward" size={18} color={Colors.white} />}
              style={styles.continueButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.8,
  },
  skipBtn: {
    padding: Spacing.xs,
  },
  skipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  illustrationSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCard: {
    width: 250,
    height: 250,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
  },
  circleGraphic: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBadgeTop: {
    position: 'absolute',
    top: 20,
    right: -15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.md,
  },
  floatingBadgeBottom: {
    position: 'absolute',
    bottom: 20,
    left: -15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.md,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.text,
  },
  contentSection: {
    paddingBottom: Spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueButton: {
    flex: 1,
  },
});
