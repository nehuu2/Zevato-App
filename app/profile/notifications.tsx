import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';

export default function NotificationsScreen() {
  const router = useRouter();
  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Notification Settings" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Service Communications</Text>

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Service Status Updates</Text>
              <Text style={styles.subtitle}>Technician assignment, ETA, job completion alerts</Text>
            </View>
            <Switch
              value={serviceUpdates}
              onValueChange={setServiceUpdates}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Scheduled Reminders</Text>
              <Text style={styles.subtitle}>Reminders 2 hours prior to scheduled technician visit</Text>
            </View>
            <Switch
              value={reminders}
              onValueChange={setReminders}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>SMS & WhatsApp Notifications</Text>
              <Text style={styles.subtitle}>Direct live tracking links and OTP verification messages</Text>
            </View>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Offers & News</Text>

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Seasonal Discounts & Deals</Text>
              <Text style={styles.subtitle}>Special tune-up offers and seasonal service packages</Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
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
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
