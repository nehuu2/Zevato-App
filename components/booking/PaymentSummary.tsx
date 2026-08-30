import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { formatCurrency } from '../../utils/formatCurrency';

export interface PaymentSummaryProps {
  itemTotal: number;
  discount?: number;
  tax?: number;
  visitingFee?: number;
  isMember?: boolean;
  style?: ViewStyle;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  itemTotal,
  discount = 0,
  tax = 0,
  visitingFee = 0,
  isMember = false,
  style,
}) => {
  const finalTotal = Math.max(0, itemTotal - discount + tax + (isMember ? 0 : visitingFee));

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>Payment Breakdown</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Item Total</Text>
        <Text style={styles.value}>{formatCurrency(itemTotal)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Discount / Promo</Text>
          <Text style={[styles.value, styles.discountValue]}>-{formatCurrency(discount)}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Inspection / Visiting Fee</Text>
        <Text style={[styles.value, isMember && styles.freeValue]}>
          {isMember ? 'FREE (Care Plus)' : formatCurrency(visitingFee || 99)}
        </Text>
      </View>

      {tax > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Taxes & GST (18%)</Text>
          <Text style={styles.value}>{formatCurrency(tax)}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.taxInclusive}>Inclusive of all taxes</Text>
        </View>
        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
      </View>
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
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  discountLabel: {
    color: Colors.success,
  },
  discountValue: {
    color: Colors.success,
  },
  freeValue: {
    color: Colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  taxInclusive: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
});

export default PaymentSummary;
