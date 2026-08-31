import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { bookingStore } from '../../store/bookingStore';
import { mockBookings } from '../../data/bookings';
import { formatCurrency } from '../../utils/formatCurrency';
import { Booking } from '../../types/booking';

import { useUserProfile } from '../../hooks/useUserProfile';

export default function InvoiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fullName, defaultAddress } = useUserProfile();

  const booking: Booking = bookingStore.getBookingById(id || '') || mockBookings[0];
  const customerName = fullName || 'Valued Customer';
  const customerAddress = booking.address
    ? `${booking.address.street}, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`
    : defaultAddress
    ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pincode}`
    : 'Customer Address';

  const totalAmount = booking.totalAmount || 499;
  const taxableAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalTax = Math.round((totalAmount - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  const handleDownload = () => {
    Alert.alert(
      'Invoice Downloaded',
      `Tax Invoice #${booking.id} has been saved to your local downloads folder.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Tax Invoice"
        subtitle={`Invoice for #${booking.id}`}
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
              <Text style={styles.invoiceNumber}>INV-{booking.id.replace('BK-', '').replace('ZEV-', '')}</Text>
              <Text style={styles.invoiceDate}>
                Date: {new Date(booking.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.billToSection}>
            <Text style={styles.sectionLabel}>Billed To:</Text>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.addressText}>{customerAddress}</Text>
          </View>

          <View style={styles.divider} />

          {/* Line Items */}
          <Text style={styles.sectionLabel}>Service Items:</Text>
          <View style={styles.itemRow}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={styles.itemName}>{booking.selectedOption.title}</Text>
              <Text style={styles.itemDesc}>
                {booking.categoryName} {booking.brandName ? `• ${booking.brandName}` : ''}
              </Text>
            </View>
            <Text style={styles.itemPrice}>{formatCurrency(totalAmount)}</Text>
          </View>

          <View style={styles.itemRow}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={styles.itemName}>Care Plus Visiting & Inspection Fee</Text>
              <Text style={styles.itemDesc}>Waived for Zevota Member</Text>
            </View>
            <Text style={[styles.itemPrice, styles.discountText]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          {/* Tax Breakdown */}
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Taxable Value</Text>
            <Text style={styles.calcVal}>₹{taxableAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>CGST (9.0%)</Text>
            <Text style={styles.calcVal}>₹{cgst.toFixed(2)}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>SGST (9.0%)</Text>
            <Text style={styles.calcVal}>₹{sgst.toFixed(2)}</Text>
          </View>

          <View style={[styles.calcRow, styles.totalCalcRow]}>
            <View>
              <Text style={styles.totalLabel}>Total Paid ({booking.paymentMethod})</Text>
              <Text style={styles.inclusiveText}>Inclusive of all GST taxes</Text>
            </View>
            <Text style={styles.totalVal}>{formatCurrency(totalAmount)}</Text>
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
