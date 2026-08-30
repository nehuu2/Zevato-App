import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceOption as ServiceOptionType } from '../../types/service';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatCurrency } from '../../utils/formatCurrency';

export interface ServiceOptionProps {
  option: ServiceOptionType;
  selected?: boolean;
  onSelect: (option: ServiceOptionType) => void;
  style?: ViewStyle;
}

export const ServiceOption: React.FC<ServiceOptionProps> = ({
  option,
  selected = false,
  onSelect,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(option)}
      style={[
        styles.card,
        selected && styles.cardSelected,
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={[styles.title, selected && styles.titleSelected]}>
            {option.title}
          </Text>
          <View style={styles.metaRow}>
            {option.rating ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#D97706" />
                <Text style={styles.ratingText}>{option.rating}</Text>
                {option.reviewCount ? (
                  <Text style={styles.reviewCount}>({option.reviewCount})</Text>
                ) : null}
              </View>
            ) : null}
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.durationText}>{option.duration}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceArea}>
          <Text style={styles.price}>{formatCurrency(option.price)}</Text>
          {option.originalPrice ? (
            <Text style={styles.originalPrice}>{formatCurrency(option.originalPrice)}</Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.description}>{option.description}</Text>

      {option.features && option.features.length > 0 && (
        <View style={styles.featuresList}>
          {option.features.map((feat, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Ionicons name="checkmark" size={14} color={Colors.success} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.warrantyPill}>
          <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
          <Text style={styles.warrantyText}>{option.warrantyDays} Days Warranty</Text>
        </View>

        <View style={[styles.selectBtn, selected && styles.selectBtnSelected]}>
          <Text style={[styles.selectBtnText, selected && styles.selectBtnTextSelected]}>
            {selected ? 'Selected' : 'Add +'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  titleArea: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  titleSelected: {
    color: Colors.primaryDark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  reviewCount: {
    fontSize: 10,
    color: '#92400E',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  priceArea: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginVertical: Spacing.xs + 2,
  },
  featuresList: {
    marginVertical: Spacing.xs,
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs + 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  warrantyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  warrantyText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  selectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  selectBtnSelected: {
    backgroundColor: Colors.primary,
  },
  selectBtnText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  selectBtnTextSelected: {
    color: Colors.white,
  },
});

export default ServiceOption;
