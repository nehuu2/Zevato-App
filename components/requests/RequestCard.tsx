import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types/booking';
import { ServiceRequest } from '../../types/request';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatCurrency } from '../../utils/formatCurrency';

export interface RequestCardProps {
  booking?: Booking;
  request?: ServiceRequest;
  onPress: () => void;
  style?: ViewStyle;
}

export const RequestCard: React.FC<RequestCardProps> = ({ booking, request, onPress, style }) => {
  // If provided booking object
  if (booking) {
    const getStatusBadge = (st: string) => {
      switch (st) {
        case 'completed':
          return { bg: Colors.successLight, text: Colors.success, label: 'Completed' };
        case 'cancelled':
          return { bg: Colors.dangerLight, text: Colors.danger, label: 'Cancelled' };
        case 'in_progress':
          return { bg: Colors.warningLight, text: '#B45309', label: 'In Progress' };
        case 'on_the_way':
          return { bg: Colors.infoLight, text: Colors.info, label: 'En Route' };
        case 'technician_assigned':
          return { bg: Colors.primaryLight, text: Colors.primaryDark, label: 'Assigned' };
        case 'confirmed':
        default:
          return { bg: Colors.primaryLight, text: Colors.primary, label: 'Confirmed' };
      }
    };

    const statusInfo = getStatusBadge(booking.status);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.card, style]}
      >
        <View style={styles.topRow}>
          <View style={styles.ticketBox}>
            <Text style={styles.ticketText}>{booking.id}</Text>
            <Text style={styles.dateText}>
              {booking.date} • {booking.timeSlot}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.badgeText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <Text style={styles.applianceText}>
          {booking.categoryName} {booking.brandName ? `(${booking.brandName})` : ''}
        </Text>
        <Text style={styles.issueText} numberOfLines={1}>
          {booking.selectedOption.title}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{formatCurrency(booking.totalAmount)}</Text>
          </View>

          <View style={styles.viewDetail}>
            <Text style={styles.viewDetailText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Fallback for custom repair request
  if (request) {
    const getReqBadge = (status: string) => {
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

    const statusInfo = getReqBadge(request.status);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.card, style]}
      >
        <View style={styles.topRow}>
          <View style={styles.ticketBox}>
            <Text style={styles.ticketText}>{request.ticketNumber}</Text>
            <Text style={styles.dateText}>{request.createdAt}</Text>
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
  }

  return null;
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
    marginTop: 2,
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
    marginBottom: 2,
  },
  issueText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
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
  pricePill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  priceText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.primaryDark,
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
