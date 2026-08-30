import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/service';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface CategoryCardProps {
  category: Category;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  selected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.cardSelected,
        style,
      ]}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Ionicons
          name={(category.icon as any) || 'hardware-chip-outline'}
          size={28}
          color={selected ? Colors.white : Colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, selected && styles.nameSelected]}>
            {category.name}
          </Text>
          {category.popular && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Popular</Text>
            </View>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {category.description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={selected ? Colors.primary : Colors.textMuted}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: 4,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  nameSelected: {
    color: Colors.primaryDark,
  },
  badge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  description: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});

export default CategoryCard;
