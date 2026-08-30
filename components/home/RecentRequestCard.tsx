import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceRequest } from '../../types/request';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatDate } from '../../utils/formatDate';

export interface RecentRequestCardProps {
  request: ServiceRequest;
  onPress?: () => void;
  style?: ViewStyle;
}

export const RecentRequestCard: React.FC<RecentRequestCardProps> = ({
  request,
  onPress,
  style,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'in_progress':
        return { bg: Colors.infoLight, text: Colors.info, label: 'In Progress' };
      case 'resolved':
      case 'closed':
        return { bg: Colors.successLight, text: Colors.success, label: 'Resolved' };
      case 'cancelled':
        return { bg: Colors.dangerLight, text: Colors.danger, label: 'Cancelled' };
      case 'pending':
      default:
        return { bg: Colors.warningLight, text: Colors.warning, label: 'Pending' };
    }
  };

  const statusInfo = getStatusColor(request.status);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="construct-outline" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.ticketNumber}>{request.ticketNumber}</Text>
            <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      <Text style={styles.applianceName}>{request.appliance}</Text>
      <Text style={styles.issue} numberOfLines={2}>
        {request.issueDescription}
      </Text>

      {request.assignedTechnician ? (
        <View style={styles.footer}>
          <Ionicons name="person-circle-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.technicianText}>
            Tech: <Text style={styles.techName}>{request.assignedTechnician}</Text>
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  applianceName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  issue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.xs + 2,
  },
  technicianText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  techName: {
    fontWeight: '600',
    color: Colors.text,
  },
});

export default RecentRequestCard;
