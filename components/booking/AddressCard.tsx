import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Address } from '../../types/user';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  style?: ViewStyle;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  selected = false,
  onSelect,
  onEdit,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      disabled={!onSelect}
      style={[
        styles.card,
        selected && styles.cardSelected,
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.labelBadge}>
          <Ionicons
            name={
              address.label === 'Home'
                ? 'home-outline'
                : address.label === 'Work'
                ? 'briefcase-outline'
                : 'location-outline'
            }
            size={14}
            color={Colors.primary}
          />
          <Text style={styles.labelText}>{address.label}</Text>
        </View>

        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}

        {onSelect && (
          <Ionicons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={selected ? Colors.primary : Colors.borderDark}
            style={styles.radioIcon}
          />
        )}
      </View>

      <Text style={styles.street}>{address.street}</Text>
      {address.apartment ? (
        <Text style={styles.apartment}>{address.apartment}</Text>
      ) : null}
      <Text style={styles.city}>
        {address.city}, {address.state} - {address.pincode}
      </Text>

      {onEdit ? (
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.7}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      ) : null}
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
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  defaultBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.xs,
  },
  defaultText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  radioIcon: {
    marginLeft: 'auto',
  },
  street: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  apartment: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  city: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  editBtn: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  editText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default AddressCard;
