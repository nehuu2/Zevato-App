import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus as RequestStatusType } from '../../types/request';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface RequestStatusProps {
  status: RequestStatusType;
  style?: ViewStyle;
}

export const RequestStatus: React.FC<RequestStatusProps> = ({ status, style }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'assigned':
        return {
          icon: 'person-outline' as const,
          color: Colors.info,
          bg: Colors.infoLight,
          title: 'Technician Assigned',
          desc: 'A service professional has been assigned to your request.',
        };
      case 'in_progress':
        return {
          icon: 'construct-outline' as const,
          color: Colors.info,
          bg: Colors.infoLight,
          title: 'Work In Progress',
          desc: 'Your appliance issue is currently being resolved.',
        };
      case 'resolved':
      case 'closed':
        return {
          icon: 'checkmark-circle-outline' as const,
          color: Colors.success,
          bg: Colors.successLight,
          title: 'Resolved',
          desc: 'This service request was completed and resolved successfully.',
        };
      case 'cancelled':
        return {
          icon: 'close-circle-outline' as const,
          color: Colors.danger,
          bg: Colors.dangerLight,
          title: 'Cancelled',
          desc: 'This service request was cancelled.',
        };
      case 'in_review':
        return {
          icon: 'search-outline' as const,
          color: Colors.warning,
          bg: Colors.warningLight,
          title: 'Under Review',
          desc: 'Our team is reviewing the issue details and scheduling.',
        };
      case 'pending':
      default:
        return {
          icon: 'time-outline' as const,
          color: Colors.warning,
          bg: Colors.warningLight,
          title: 'Pending Allocation',
          desc: 'Request received. We will assign a technician shortly.',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bg }, style]}>
      <Ionicons name={config.icon} size={24} color={config.color} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.desc}>{config.desc}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  desc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});

export default RequestStatus;
