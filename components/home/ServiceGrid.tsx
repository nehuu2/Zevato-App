import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/service';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface ServiceGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  style?: ViewStyle;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  categories,
  onSelectCategory,
  style,
}) => {
  return (
    <View style={[styles.grid, style]}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          activeOpacity={0.7}
          onPress={() => onSelectCategory(cat)}
          style={styles.card}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={(cat.icon as any) || 'build-outline'}
              size={26}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.categoryName} numberOfLines={2}>
            {cat.name}
          </Text>
          {cat.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULAR</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
    justifyContent: 'flex-start',
  },
  card: {
    width: '25%',
    padding: Spacing.xs,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(11, 92, 255, 0.1)',
    ...Elevation.sm,
  },
  categoryName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 15,
  },
  popularBadge: {
    marginTop: 2,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  popularText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B45309',
  },
});

export default ServiceGrid;
