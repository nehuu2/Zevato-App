import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Brand } from '../../types/service';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export interface BrandCardProps {
  brand: Brand;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
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
      <View style={[styles.avatar, selected && styles.avatarSelected]}>
        <Text style={[styles.avatarText, selected && styles.avatarTextSelected]}>
          {brand.name.substring(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
        {brand.name}
      </Text>
      {selected ? (
        <View style={styles.checkIcon}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
    ...Elevation.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  avatarSelected: {
    backgroundColor: Colors.primaryLight,
  },
  avatarText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  avatarTextSelected: {
    color: Colors.primary,
  },
  name: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  nameSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default BrandCard;
