import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceRequest } from '../../types/request';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatDate } from '../../utils/formatDate';

export interface RequestCardProps {
  request: ServiceRequest;
  onPress: () => void;
  style?: ViewStyle;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress, style }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'in_progress':
        return { bg: Colors.infoLight, text: Colors.info, label: 'In Progress' };
      case 'resolved':
      case 'closed':
        return { bg: Colors.successLight, text: Colors.success, label: 'Resolved' };
      case 'cancelled':
        return { bg: Colors.dangerLight, text: Colors.danger, label: 'Cancelled' };
      case 'in_review':
        return { bg: Colors.warningLight, text: Colors.warning, label: 'In Review' };
      case 'pending':
      default:
        return { bg: Colors.surface, text: Colors.textSecondary, label: 'Pending' };
    }
  };

  const statusInfo = getStatusBadge(request.status);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.topRow}>
        <View style={styles.ticketBox}>
          <Text style={styles.ticketText}>{request.ticketNumber}</Text>
          <Text style={styles.dateText}>{formatDate(request.createdAt)}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      <Text style={styles.applianceText}>{request.appliance}</Text>
      <Text style={styles.issueText} numberOfLines={2}>
        {request.issueDescription}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.categoryPill}>
          <Ionicons name="pricetag-outline" size={12} color={Colors.primary} />
          <Text style={styles.categoryText}>{request.category}</Text>
        </View>

        <View style={styles.viewDetail}>
          <Text style={styles.viewDetailText}>View Updates</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  ticketBox: {
    flex: 1,
  },
  ticketText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  dateText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  applianceText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  issueText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default RequestCard;
