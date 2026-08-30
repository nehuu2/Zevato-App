import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import AppConfig from '../../constants/config';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="About Zevota Care" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBox}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={36} color={Colors.white} />
          </View>
          <Text style={styles.brandTitle}>ZEVOTA CARE</Text>
          <Text style={styles.versionText}>Version {AppConfig.version}</Text>
          <Text style={styles.tagline}>{AppConfig.appTagline}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.bodyText}>
            Zevota Care was founded to bring transparency, speed, and uncompromising reliability to home appliance repairs. We connect homeowners with certified, verified technicians and guarantee authentic OEM spare parts with a strict 30-day revisit warranty.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Standards</Text>
          <Text style={styles.bodyText}>
            • 100% Background-Checked Technicians{'\n'}
            • Standard Upfront Rate Cards{'\n'}
            • 30-Day Free Revisit Guarantee{'\n'}
            • 24/7 Dedicated Customer Support
          </Text>
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
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  versionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tagline: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 260,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bodyText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
