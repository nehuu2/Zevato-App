import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header / Badge */}
        <View style={styles.topSection}>
          <View style={styles.brandBadge}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
            <Text style={styles.brandBadgeText}>ZEVOTA CARE</Text>
          </View>
        </View>

        {/* Hero Visual Area */}
        <View style={styles.heroSection}>
          <View style={styles.heroGlow}>
            <View style={styles.heroCircle}>
              <View style={styles.iconGroup}>
                <View style={[styles.floatingIcon, styles.iconTopLeft]}>
                  <Ionicons name="snow-outline" size={24} color={Colors.primary} />
                </View>
                <View style={[styles.floatingIcon, styles.iconTopRight]}>
                  <Ionicons name="cube-outline" size={24} color="#059669" />
                </View>
                <View style={[styles.floatingIcon, styles.iconBottomLeft]}>
                  <Ionicons name="shirt-outline" size={24} color="#D97706" />
                </View>
                <View style={[styles.floatingIcon, styles.iconBottomRight]}>
                  <Ionicons name="tv-outline" size={24} color="#7C3AED" />
                </View>
                <View style={styles.centerIcon}>
                  <Ionicons name="construct" size={42} color={Colors.white} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.bottomSection}>
          <Text style={styles.welcomeHeading}>
            Hassle-Free Care for All Your Home Appliances
          </Text>

          <Text style={styles.welcomeSubtitle}>
            Certified technicians, verified spare parts, and doorstep service within 2 hours.
          </Text>

          {/* Feature Highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.featureText}>100% Genuine Spares</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.featureText}>30-Day Warranty</Text>
            </View>
          </View>

          {/* Primary CTA */}
          <Button
            title="Get Started"
            onPress={() => router.push('/(onboarding)/intro-1')}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
            style={styles.ctaButton}
          />
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
    paddingVertical: Spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  brandBadgeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroGlow: {
    width: 260,
    height: 260,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCircle: {
    width: 220,
    height: 220,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconGroup: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.md,
  },
  floatingIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.sm,
  },
  iconTopLeft: {
    top: 14,
    left: 20,
  },
  iconTopRight: {
    top: 14,
    right: 20,
  },
  iconBottomLeft: {
    bottom: 14,
    left: 20,
  },
  iconBottomRight: {
    bottom: 14,
    right: 20,
  },
  bottomSection: {
    paddingBottom: Spacing.sm,
  },
  welcomeHeading: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
  },
  ctaButton: {
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
