import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';

export default function InvoiceScreen() {
  const router = useRouter();

  const handleDownload = () => {
    Alert.alert('Invoice Downloaded', 'Tax invoice PDF saved to device downloads.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tax Invoice" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Invoice Paper Simulation */}
        <View style={styles.invoicePaper}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.companyName}>ZEVOTA CARE</Text>
              <Text style={styles.gstText}>GSTIN: 07AAECZ9821M1Z5</Text>
            </View>
            <View style={styles.invoiceMeta}>
              <Text style={styles.invoiceNumber}>INV-2026-89021</Text>
              <Text style={styles.invoiceDate}>Date: 30 Aug 2026</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.billToSection}>
            <Text style={styles.sectionLabel}>Billed To:</Text>
            <Text style={styles.customerName}>Alex Johnson</Text>
            <Text style={styles.addressText}>Flat 402, Lotus Orchid Heights, Sector 48, Gurugram</Text>
          </View>

          <View style={styles.divider} />

          {/* Line Items */}
          <Text style={styles.sectionLabel}>Service Items:</Text>
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Power Jet AC Deep Cleaning</Text>
              <Text style={styles.itemDesc}>Split AC • Daikin 1.5 Ton</Text>
            </View>
            <Text style={styles.itemPrice}>₹499.00</Text>
          </View>

          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>Care Plus Membership Discount</Text>
              <Text style={styles.itemDesc}>Free Inspection & Visit</Text>
            </View>
            <Text style={[styles.itemPrice, styles.discountText]}>-₹99.00</Text>
          </View>

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Taxable Amount</Text>
            <Text style={styles.calcVal}>₹422.88</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>CGST (9%)</Text>
            <Text style={styles.calcVal}>₹38.06</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>SGST (9%)</Text>
            <Text style={styles.calcVal}>₹38.06</Text>
          </View>

          <View style={[styles.calcRow, styles.totalCalcRow]}>
            <Text style={styles.totalLabel}>Total Paid (UPI)</Text>
            <Text style={styles.totalVal}>₹499.00</Text>
          </View>
        </View>

        <Button
          title="Download PDF Copy"
          leftIcon={<Ionicons name="download-outline" size={18} color={Colors.white} />}
          onPress={handleDownload}
          style={styles.downloadBtn}
        />
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
    paddingBottom: Spacing.xl,
  },
  invoicePaper: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.primary,
  },
  gstText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
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
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.text,
  },
  totalVal: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  downloadBtn: {
    width: '100%',
  },
});
