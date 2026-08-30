import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface ProtectionCardProps {
  onLearnMore?: () => void;
  style?: ViewStyle;
}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({
  onLearnMore,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-half" size={32} color="#0B5CFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Zevota 360° Shield</Text>
          <Text style={styles.subtitle}>
            Unlimited repairs, zero labor charges, and priority technician dispatch starting at ₹99/mo.
          </Text>
        </View>
      </View>

      <View style={styles.featuresRow}>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={styles.featureText}>Zero visit fees</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={styles.featureText}>2 hr dispatch</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
          <Text style={styles.featureText}>Free tune-ups</Text>
        </View>
      </View>

      {onLearnMore ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLearnMore}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>Explore Annual Plans</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF4FF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#D4E2FF',
    ...Elevation.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#DBE7FF',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#C7DAFF',
    gap: 4,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default ProtectionCard;
