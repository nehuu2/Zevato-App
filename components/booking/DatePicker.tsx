import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface DateOption {
  id: string;
  dayName: string;
  dateStr: string;
  isToday?: boolean;
}

export interface DatePickerProps {
  dates: DateOption[];
  selectedDateId: string;
  onSelectDate: (date: DateOption) => void;
  style?: ViewStyle;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  dates,
  selectedDateId,
  onSelectDate,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((item) => {
          const isSelected = item.id === selectedDateId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectDate(item)}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected && styles.dayNameSelected,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  isSelected && styles.dateNumberSelected,
                ]}
              >
                {item.dateStr}
              </Text>
              {item.isToday && (
                <View
                  style={[
                    styles.todayBadge,
                    isSelected && styles.todayBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.todayText,
                      isSelected && styles.todayTextSelected,
                    ]}
                  >
                    Today
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingRight: Spacing.base,
    gap: Spacing.sm,
  },
  dateCard: {
    width: 68,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  dateCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dayName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dateNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  dateNumberSelected: {
    color: Colors.white,
  },
  todayBadge: {
    marginTop: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  todayBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  todayText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  todayTextSelected: {
    color: Colors.white,
  },
});

export default DatePicker;
