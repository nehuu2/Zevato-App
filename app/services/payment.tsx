import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import BookingStepper from '../../components/booking/BookingStepper';
import PaymentSummary from '../../components/booking/PaymentSummary';
import { bookingStore } from '../../store/bookingStore';

const paymentOptions = [
  { id: 'upi', title: 'UPI Instant Pay', subtitle: 'Google Pay, PhonePe, Paytm', icon: 'qr-code-outline' },
  { id: 'card', title: 'Credit / Debit Card', subtitle: 'Visa, MasterCard, RuPay', icon: 'card-outline' },
  { id: 'netbanking', title: 'Net Banking', subtitle: 'All major Indian banks', icon: 'business-outline' },
  { id: 'cod', title: 'Pay on Service Completion', subtitle: 'Cash or UPI to technician after repair', icon: 'cash-outline' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const [selectedMethod, setSelectedMethod] = useState(draft.paymentMethod || 'upi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const servicePrice = draft.service?.price || 399;

  const handleConfirmBooking = async () => {
    // Auto-fallback for service if booked via quick request
    if (!draft.service) {
      const fallbackService = {
        id: 'opt-std',
        title: 'Standard Appliance Service',
        description: 'Comprehensive inspection and diagnostic checkup',
        duration: '45 - 60 mins',
        price: 399,
        features: ['Standard inspection', '30-day warranty'],
        included: ['Diagnosis', 'Basic labor'],
        excluded: ['Parts cost'],
        warrantyDays: 30,
      };
      bookingStore.setService(fallbackService);
    }

    if (!draft.date || !draft.timeSlot) {
      setErrorMsg('Appointment date or time slot is missing.');
      return;
    }
    if (!draft.address) {
      setErrorMsg('Service address is missing. Please select an address.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const selectedOptionObj = paymentOptions.find((p) => p.id === selectedMethod);
    bookingStore.setPaymentMethod(selectedOptionObj?.title || selectedMethod);

    // Simulate local booking confirmation
    setTimeout(() => {
      const confirmed = bookingStore.confirmBooking();
      setLoading(false);
      router.replace({
        pathname: '/services/booking-confirmed',
        params: { id: confirmed.id },
      });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Payment & Review" showBack onBackPress={() => router.back()} />
      <BookingStepper currentStep={4} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Review Card */}
        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Appointment Summary</Text>

          <View style={styles.reviewRow}>
            <Ionicons name="construct" size={16} color={Colors.primary} />
            <Text style={styles.reviewLabel}>Service:</Text>
            <Text style={styles.reviewVal} numberOfLines={1}>
              {draft.service?.title || 'Standard Service'}
            </Text>
          </View>

          <View style={styles.reviewRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.reviewLabel}>Slot:</Text>
            <Text style={styles.reviewVal}>
              {draft.date || 'Today'}, {draft.timeSlot || '02:00 PM'}
            </Text>
          </View>

          <View style={styles.reviewRow}>
            <Ionicons name="location-outline" size={16} color={Colors.primary} />
            <Text style={styles.reviewLabel}>Address:</Text>
            <Text style={styles.reviewVal} numberOfLines={1}>
              {draft.address?.street
                ? [draft.address.street, draft.address.city].filter(Boolean).join(', ')
                : 'Service Address'}
            </Text>
          </View>
        </View>

        {/* Payment Methods Selection */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.paymentList}>
          {paymentOptions.map((opt) => {
            const isSelected = opt.id === selectedMethod || opt.title === selectedMethod;
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => setSelectedMethod(opt.id)}
                style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
              >
                <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                  <Ionicons
                    name={opt.icon as any}
                    size={22}
                    color={isSelected ? Colors.primary : Colors.textSecondary}
                  />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodTitle, isSelected && styles.methodTitleSelected]}>
                    {opt.title}
                  </Text>
                  <Text style={styles.methodSubtitle}>{opt.subtitle}</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Colors.primary : Colors.borderDark}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Price Breakdown */}
        <PaymentSummary
          itemTotal={servicePrice}
          discount={0}
          visitingFee={0}
          isMember={true}
        />

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Action Button */}
        <Button
          title={`Confirm Booking (₹${servicePrice})`}
          loading={loading}
          onPress={handleConfirmBooking}
          rightIcon={<Ionicons name="shield-checkmark" size={18} color={Colors.white} />}
          style={styles.submitBtn}
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
  scrollContent: {
    padding: Spacing.base,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
  },
  reviewTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  reviewLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    width: 60,
  },
  reviewVal: {
    flex: 1,
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  paymentList: {
    marginBottom: Spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  paymentCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGhost,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconBoxSelected: {
    backgroundColor: Colors.primaryLight,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  methodTitleSelected: {
    color: Colors.primaryDark,
  },
  methodSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
