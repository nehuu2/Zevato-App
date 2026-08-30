import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingStatus } from '../../types/booking';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface BookingProgressProps {
  status: BookingStatus;
  style?: ViewStyle;
}

const statusSteps = [
  { key: 'confirmed', label: 'Booking Confirmed', desc: 'Request received & validated' },
  { key: 'technician_assigned', label: 'Technician Assigned', desc: 'Expert allocated to your service' },
  { key: 'on_the_way', label: 'On The Way', desc: 'Technician is en route to your location' },
  { key: 'in_progress', label: 'Service In Progress', desc: 'Inspection & repair underway' },
  { key: 'completed', label: 'Service Completed', desc: 'Tested & warranty activated' },
];

export const BookingProgress: React.FC<BookingProgressProps> = ({ status, style }) => {
  const getStepIndex = (st: BookingStatus): number => {
    switch (st) {
      case 'confirmed':
        return 0;
      case 'technician_assigned':
        return 1;
      case 'on_the_way':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <View style={[styles.container, style]}>
      {statusSteps.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isPending = idx > currentIndex;

        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.timelineColumn}>
              <View
                style={[
                  styles.node,
                  isDone && styles.nodeDone,
                  isCurrent && styles.nodeCurrent,
                  isPending && styles.nodePending,
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                ) : isCurrent ? (
                  <View style={styles.currentPulse} />
                ) : (
                  <View style={styles.pendingDot} />
                )}
              </View>
              {idx < statusSteps.length - 1 && (
                <View
                  style={[
                    styles.verticalLine,
                    idx < currentIndex && styles.verticalLineDone,
                  ]}
                />
              )}
            </View>

            <View style={styles.textColumn}>
              <Text
                style={[
                  styles.stepTitle,
                  isCurrent && styles.stepTitleCurrent,
                  isDone && styles.stepTitleDone,
                ]}
              >
                {step.label}
              </Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.sm,
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeDone: {
    backgroundColor: Colors.success,
  },
  nodeCurrent: {
    backgroundColor: Colors.primary,
  },
  nodePending: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
  },
  currentPulse: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.textMuted,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  verticalLineDone: {
    backgroundColor: Colors.success,
  },
  textColumn: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  stepTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  stepTitleCurrent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  stepTitleDone: {
    color: Colors.text,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
});

export default BookingProgress;
