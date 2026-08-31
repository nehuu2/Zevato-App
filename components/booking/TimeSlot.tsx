import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlotOption } from '../../types/booking';

export { TimeSlotOption };

export interface TimeSlotProps {
  slots: TimeSlotOption[];
  selectedSlotId: string;
  onSelectSlot: (slot: TimeSlotOption) => void;
  style?: ViewStyle;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  style,
}) => {
  return (
    <View style={[styles.grid, style]}>
      {slots.map((slot) => {
        const isSelected = slot.id === selectedSlotId;
        const isDisabled = !slot.available;

        return (
          <TouchableOpacity
            key={slot.id}
            disabled={isDisabled}
            activeOpacity={0.8}
            onPress={() => onSelectSlot(slot)}
            style={[
              styles.slotButton,
              isSelected && styles.slotButtonSelected,
              isDisabled && styles.slotButtonDisabled,
            ]}
          >
            <Ionicons
              name={
                slot.period === 'morning'
                  ? 'sunny-outline'
                  : slot.period === 'afternoon'
                  ? 'partly-sunny-outline'
                  : 'moon-outline'
              }
              size={16}
              color={
                isSelected
                  ? Colors.primary
                  : isDisabled
                  ? Colors.textMuted
                  : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.slotText,
                isSelected && styles.slotTextSelected,
                isDisabled && styles.slotTextDisabled,
              ]}
            >
              {slot.time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  slotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '48%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  slotButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  slotButtonDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
    opacity: 0.5,
  },
  slotText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
  },
  slotTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  slotTextDisabled: {
    color: Colors.textMuted,
  },
});

export default TimeSlot;
