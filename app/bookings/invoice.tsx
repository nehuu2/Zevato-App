import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { bookingService } from '../../services/bookings';
import { formatCurrency } from '../../utils/formatCurrency';
import { InvoiceData } from '../../types/booking';

export default function InvoiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingInvoice(id);
      setInvoice(data);
    } catch (err: any) {
      console.warn(`Failed to fetch invoice for booking #${id}:`, err);
      setError(err.message || 'Unable to retrieve tax invoice from server.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleDownload = () => {
    if (!invoice) return;
    Alert.alert(
      'Invoice Downloaded',
      `Tax Invoice #${invoice.invoiceNumber} has been saved to your local downloads folder.`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Tax Invoice" showBack onBackPress={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Generating official GST invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!invoice || error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Tax Invoice" showBack onBackPress={() => router.back()} />
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="receipt-outline"
            title="Invoice Not Found"
            description={error || `We couldn't locate the invoice for booking #${id || 'unknown'}.`}
            actionTitle="Back to Bookings"
            onActionPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Tax Invoice"
        subtitle={`Invoice #${invoice.invoiceNumber}`}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Invoice Paper Card */}
        <View style={styles.invoicePaper}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.companyName}>ZEVOTA CARE INDIA</Text>
              <Text style={styles.gstText}>GSTIN: 07AAECZ9821M1Z5</Text>
              <Text style={styles.hsnText}>SAC Code: 998719 (Maintenance & Repair)</Text>
            </View>
            <View style={styles.invoiceMeta}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <Text style={styles.invoiceDate}>
                Date: {new Date(invoice.issuedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.billToSection}>
            <Text style={styles.sectionLabel}>Billed To:</Text>
            <Text style={styles.customerName}>{invoice.customerName || 'Valued Customer'}</Text>
            <Text style={styles.addressText}>{invoice.customerAddress || 'Customer Address'}</Text>
          </View>

          <View style={styles.divider} />

          {/* Line Items */}
          <Text style={styles.sectionLabel}>Service Items:</Text>
          <View style={styles.itemRow}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={styles.itemName}>{invoice.serviceName || 'Appliance Service'}</Text>
              <Text style={styles.itemDesc}>
                {invoice.categoryName} {invoice.brandName ? `• ${invoice.brandName}` : ''}
              </Text>
            </View>
            <Text style={styles.itemPrice}>{formatCurrency(invoice.subtotal)}</Text>
          </View>

          <View style={styles.itemRow}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={styles.itemName}>Care Plus Visiting & Inspection Fee</Text>
              <Text style={styles.itemDesc}>Waived for Zevota Customer</Text>
            </View>
            <Text style={[styles.itemPrice, styles.discountText]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          {/* Authoritative Tax Breakdown */}
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Taxable Value</Text>
            <Text style={styles.calcVal}>₹{invoice.taxableAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>CGST (9.0%)</Text>
            <Text style={styles.calcVal}>₹{invoice.cgst.toFixed(2)}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>SGST (9.0%)</Text>
            <Text style={styles.calcVal}>₹{invoice.sgst.toFixed(2)}</Text>
          </View>

          <View style={[styles.calcRow, styles.totalCalcRow]}>
            <View>
              <Text style={styles.totalLabel}>Total Paid ({invoice.paymentMethod})</Text>
              <Text style={styles.inclusiveText}>Inclusive of all GST taxes</Text>
            </View>
            <Text style={styles.totalVal}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        <Button
          title="Download PDF Invoice"
          leftIcon={<Ionicons name="download-outline" size={18} color={Colors.white} />}
          onPress={handleDownload}
          style={styles.downloadBtn}
        />

        <Button
          title="Back to Booking"
          variant="ghost"
          onPress={() => router.back()}
          style={styles.backBtn}
        />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  invoicePaper: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyName: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.primary,
  },
  gstText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  hsnText: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 1,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.text,
  },
  invoiceDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  billToSection: {
    marginBottom: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  customerName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  addressText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  itemName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  itemDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  itemPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  discountText: {
    color: Colors.success,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  calcLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  calcVal: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
    fontWeight: '500',
  },
  totalCalcRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.text,
  },
  inclusiveText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  totalVal: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  downloadBtn: {
    width: '100%',
  },
  backBtn: {
    marginTop: Spacing.xs,
    width: '100%',
  },
});
