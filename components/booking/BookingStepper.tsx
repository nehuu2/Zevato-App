import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export interface Step {
  id: number;
  label: string;
}

export interface BookingStepperProps {
  currentStep: number;
  steps?: Step[];
  style?: ViewStyle;
}

const defaultSteps: Step[] = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Schedule' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'Payment' },
];

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  steps = defaultSteps,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      isActive && styles.stepNumberActive,
                    ]}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  isCompleted && styles.labelCompleted,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  isCompleted && styles.lineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 2,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  circleCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  labelCompleted: {
    color: Colors.success,
    fontWeight: '600',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.success,
  },
});

export default BookingStepper;
