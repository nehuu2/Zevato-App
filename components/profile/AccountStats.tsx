import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface AccountStatsProps {
  completedBookings?: number;
  activeRequests?: number;
  savedAmount?: number;
  style?: ViewStyle;
}

export const AccountStats: React.FC<AccountStatsProps> = ({
  completedBookings = 14,
  activeRequests = 1,
  savedAmount = 2450,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{completedBookings}</Text>
        <Text style={styles.statLabel}>Services Done</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={[styles.statNumber, styles.activeNumber]}>{activeRequests}</Text>
        <Text style={styles.statLabel}>Active Request</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={[styles.statNumber, styles.savedNumber]}>₹{savedAmount}</Text>
        <Text style={styles.statLabel}>Care Savings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginVertical: Spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  activeNumber: {
    color: Colors.primary,
  },
  savedNumber: {
    color: Colors.success,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
  },
});

export default AccountStats;
