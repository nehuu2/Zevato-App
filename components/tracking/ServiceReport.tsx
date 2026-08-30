import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface ServiceReportProps {
  technicianNotes?: string;
  partsReplaced?: string[];
  warrantyUntil?: string;
  ratingGiven?: number;
  style?: ViewStyle;
}

export const ServiceReport: React.FC<ServiceReportProps> = ({
  technicianNotes = 'Cleaned air filters, serviced indoor blower motor, checked compressor amp load (3.8A normal). Cooling restored.',
  partsReplaced = [],
  warrantyUntil = '30 Sep 2026',
  ratingGiven,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={20} color={Colors.primary} />
        <Text style={styles.title}>Service Completion Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Technician Diagnostics & Notes:</Text>
        <Text style={styles.notesText}>{technicianNotes}</Text>
      </View>

      {partsReplaced && partsReplaced.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Parts Replaced:</Text>
          {partsReplaced.map((part, idx) => (
            <View key={idx} style={styles.partItem}>
              <Ionicons name="hardware-chip-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.partText}>{part}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.warrantyBox}>
        <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
        <View style={styles.warrantyInfo}>
          <Text style={styles.warrantyTitle}>Service Warranty Active</Text>
          <Text style={styles.warrantySubtitle}>Covers revisit & labor till {warrantyUntil}</Text>
        </View>
      </View>

      {ratingGiven ? (
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>Your Rating:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= ratingGiven ? 'star' : 'star-outline'}
                size={16}
                color="#D97706"
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  partText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.text,
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xs,
  },
  warrantyInfo: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: '#15803D',
  },
  warrantySubtitle: {
    fontSize: Typography.fontSize.xs,
    color: '#166534',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  ratingLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
});

export default ServiceReport;
