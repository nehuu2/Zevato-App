import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Product } from '../../types/service';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
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
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Ionicons
          name="cube-outline"
          size={24}
          color={selected ? Colors.primary : Colors.textSecondary}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={2}>
            {product.name}
          </Text>
        </View>
        {product.model ? (
          <View style={styles.modelBadge}>
            <Text style={styles.modelText}>Model: {product.model}</Text>
          </View>
        ) : null}
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
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
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconBoxSelected: {
    backgroundColor: Colors.primaryLight,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
  },
  nameSelected: {
    color: Colors.primaryDark,
  },
  modelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginVertical: 3,
  },
  modelText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
});

export default ProductCard;
