import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface SubscriptionCardProps {
  planName?: string;
  expiryDate?: string;
  remainingServices?: number;
  onPress?: () => void;
  onManagePress?: () => void;
  style?: ViewStyle;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  planName = 'Zevota Care Plus',
  expiryDate = '31 Dec 2026',
  remainingServices = 3,
  onPress,
  onManagePress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color="#FFF" />
          <Text style={styles.badgeText}>ACTIVE PLAN</Text>
        </View>
        <Text style={styles.expiryText}>Renews {expiryDate}</Text>
      </View>

      <View style={styles.cardBody}>
        <View>
          <Text style={styles.planTitle}>{planName}</Text>
          <Text style={styles.planSubtitle}>
            Full home appliance protection with zero service charges
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.benefitPill}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.white} />
          <Text style={styles.benefitText}>
            {remainingServices} Free Tune-ups left
          </Text>
        </View>

        {onManagePress ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onManagePress}
            style={styles.manageBtn}
          >
            <Text style={styles.manageBtnText}>Manage</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Elevation.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.6,
  },
  expiryText: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardBody: {
    marginBottom: Spacing.lg,
  },
  planTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: Spacing.md,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  manageBtnText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default SubscriptionCard;
