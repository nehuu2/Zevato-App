import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
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

const CATEGORY_THUMBNAILS: Record<string, string> = {
  ac: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=240',
  refrigerator: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=240',
  'washing-machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=240',
  microwave: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=240',
  'water-purifier': 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=240',
  chimney: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=240',
  television: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=240',
  geyser: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=240',
};

const CATEGORY_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  ac: { icon: 'snow', color: '#0284C7', bg: '#E0F2FE' },
  refrigerator: { icon: 'cube', color: '#2563EB', bg: '#DBEAFE' },
  'washing-machine': { icon: 'shirt', color: '#7C3AED', bg: '#EDE9FE' },
  microwave: { icon: 'flame', color: '#EA580C', bg: '#FFEDD5' },
  'water-purifier': { icon: 'water', color: '#0891B2', bg: '#CFFAFE' },
  chimney: { icon: 'funnel', color: '#4F46E5', bg: '#E0E7FF' },
  television: { icon: 'tv', color: '#D97706', bg: '#FEF3C7' },
  geyser: { icon: 'thermometer', color: '#DC2626', bg: '#FEE2E2' },
};

const getStatusBadge = (st: string) => {
  switch (st) {
    case 'completed':
    case 'resolved':
    case 'closed':
      return { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0', label: 'Completed' };
    case 'in_progress':
    case 'assigned':
      return { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE', label: 'In Progress' };
    case 'on_the_way':
      return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD', label: 'On The Way' };
    case 'technician_assigned':
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Assigned' };
    case 'confirmed':
      return { bg: '#E0E7FF', text: '#4338CA', border: '#C7D2FE', label: 'Confirmed' };
    case 'cancelled':
      return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA', label: 'Cancelled' };
    case 'in_review':
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'In Review' };
    case 'pending':
    default:
      return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB', label: 'Pending' };
  }
};

export const RequestCard: React.FC<RequestCardProps> = ({ booking, request, onPress, style }) => {
  if (booking) {
    const catId = (booking.categoryName || '').toLowerCase().replace(/\s+/g, '-');
    const catKey = Object.keys(CATEGORY_THUMBNAILS).find((k) => catId.includes(k)) || 'ac';
    const thumbnailUri = CATEGORY_THUMBNAILS[catKey] || CATEGORY_THUMBNAILS.ac;
    const iconConfig = CATEGORY_ICONS[catKey] || { icon: 'build', color: Colors.primary, bg: Colors.primaryLight };
    const statusInfo = getStatusBadge(booking.status);

    const productTitle =
      booking.productName ||
      (booking.brandName
        ? `${booking.brandName} ${booking.categoryName}`
        : `${booking.categoryName} Service`);

    const issueText =
      booking.selectedOption?.title ||
      booking.serviceName ||
      'Appliance Repair & Servicing';

    const bookingIdDisplay = booking.bookingNumber || booking.id;
    const isPaid = booking.paymentStatus === 'paid';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.card, style]}
      >
        {/* Main Content Row */}
        <View style={styles.mainRow}>
          {/* Left Thumbnail Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.thumbnail}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Right Text Details */}
          <View style={styles.detailsContainer}>
            {/* Top Row: Category Icon + Title + Status Badge */}
            <View style={styles.topRow}>
              <View style={styles.titleWithIcon}>
                <View style={[styles.catIconPill, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.icon} size={12} color={iconConfig.color} />
                </View>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {productTitle}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
                ]}
              >
                <Text style={[styles.statusText, { color: statusInfo.text }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {/* Issue Description */}
            <Text style={styles.issueText} numberOfLines={1}>
              <Text style={styles.issueLabel}>Issue: </Text>
              {issueText}
            </Text>

            {/* Date & Time Slot Row */}
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.dateTimeText}>{booking.date}</Text>
              </View>
              <Text style={styles.dateTimeDivider}>•</Text>
              <View style={styles.dateTimeItem}>
                <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.dateTimeText}>{booking.timeSlot}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card Footer Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Row: Booking ID + Price & Paid Tag + Chevron */}
        <View style={styles.bottomRow}>
          <View style={styles.bookingIdBox}>
            <Text style={styles.bookingIdText}>Booking ID: {bookingIdDisplay}</Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceCol}>
              <Text style={styles.priceText}>{formatCurrency(booking.totalAmount)}</Text>
              <Text style={[styles.paidTag, { color: isPaid ? Colors.success : Colors.textSecondary }]}>
                {isPaid ? 'Paid' : 'Pay on Service'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Fallback for custom repair request tickets
  if (request) {
    const statusInfo = getStatusBadge(request.status);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.card, style]}
      >
        <View style={styles.mainRow}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: CATEGORY_THUMBNAILS.ac }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.topRow}>
              <View style={styles.titleWithIcon}>
                <View style={[styles.catIconPill, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="construct" size={12} color="#0284C7" />
                </View>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {request.appliance}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.bg, borderColor: statusInfo.border },
                ]}
              >
                <Text style={[styles.statusText, { color: statusInfo.text }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            <Text style={styles.issueText} numberOfLines={1}>
              <Text style={styles.issueLabel}>Issue: </Text>
              {request.issueDescription}
            </Text>

            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.dateTimeText}>{request.createdAt}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.bottomRow}>
          <Text style={styles.bookingIdText}>Ticket ID: {request.ticketNumber}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.viewDetailText}>View Updates</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
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
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  catIconPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  issueText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  issueLabel: {
    color: '#6B7280',
    fontWeight: '500',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateTimeDivider: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingIdBox: {
    flex: 1,
  },
  bookingIdText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  paidTag: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default RequestCard;
