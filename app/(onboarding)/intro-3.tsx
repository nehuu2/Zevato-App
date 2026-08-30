import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import { authStore } from '../../store/authStore';

export default function Intro3Screen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinishOnboarding = async () => {
    try {
      setLoading(true);
      await authStore.setOnboardingCompleted(true);
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error('Error completing onboarding:', e);
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar with Back */}
        <View style={styles.topBar}>
          <BackButton onPress={() => router.back()} />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>STEP 3 OF 3</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Illustration Card */}
        <View style={styles.illustrationSection}>
          <View style={styles.illustrationCard}>
            <View style={styles.circleGraphic}>
              <Ionicons name="navigate-circle" size={60} color="#7C3AED" />
            </View>

            {/* Floating verification badges */}
            <View style={styles.floatingBadgeTop}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.badgeText}>30-Day Revisit Warranty</Text>
            </View>

            <View style={styles.floatingBadgeBottom}>
              <Ionicons name="location" size={16} color="#7C3AED" />
              <Text style={styles.badgeText}>Live Technician Map</Text>
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.contentSection}>
          {/* Dot Indicator */}
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          <Text style={styles.title}>Live Tracking & 30-Day Guarantee</Text>
          <Text style={styles.description}>
            Follow your technician in real-time, get digital service receipts, and enjoy a hassle-free 30-day warranty on every job.
          </Text>

          {/* Final CTA Button */}
          <View style={styles.actionRow}>
            <Button
              title="Get Started Now"
              loading={loading}
              onPress={handleFinishOnboarding}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
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
  illustrationSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCard: {
    width: 250,
    height: 250,
    borderRadius: BorderRadius.xxl,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#EDE9FE',
  },
  circleGraphic: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBadgeTop: {
    position: 'absolute',
    top: 20,
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
  floatingBadgeBottom: {
    position: 'absolute',
    bottom: 20,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
