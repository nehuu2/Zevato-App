import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { bookingService } from '../../services/bookings';

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
  const [processingStage, setProcessingStage] = useState('Initiating simulated payment...');
  const [testOutcome, setTestOutcome] = useState<'success' | 'failure' | 'cancelled'>('success');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const servicePrice = draft.service?.price || 399;

  const handleConfirmBooking = async () => {
    const serviceOptionId = draft.service?.id || 'ac-foam-jet';

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
    setProcessingStage('Simulating bank gateway handshake...');

    const selectedOptionObj = paymentOptions.find((p) => p.id === selectedMethod);
    const chosenPaymentMethod = selectedOptionObj?.title || selectedMethod;
    bookingStore.setPaymentMethod(chosenPaymentMethod);

    // Simulate realistic payment processing latency
    setTimeout(() => {
      setProcessingStage('Authorizing simulated credentials...');
    }, 400);

    try {
      const createdBooking = await bookingService.createBooking({
        serviceOptionId,
        addressId: draft.address.id.startsWith('addr-') ? undefined : draft.address.id,
        address: {
          label: draft.address.label,
          street: draft.address.street,
          apartment: draft.address.apartment,
          city: draft.address.city,
          state: draft.address.state,
          pincode: draft.address.pincode,
          country: draft.address.country,
        },
        scheduledDate: draft.date,
        scheduledTimeSlot: draft.timeSlot,
        paymentMethod: chosenPaymentMethod,
        notes: draft.notes,
        simulatedOutcome: testOutcome,
      });

      setProcessingStage('Simulated payment approved! 🎉');

      setTimeout(() => {
        bookingStore.addConfirmedBooking(createdBooking);
        bookingStore.setLastConfirmedBooking(createdBooking);
        setLoading(false);
        router.replace({
          pathname: '/services/booking-confirmed',
          params: { id: createdBooking.id },
        });
      }, 500);
    } catch (err: any) {
      setLoading(false);
      console.warn('Simulated payment failed:', err);
      const message = err.message || 'Simulated transaction could not be completed.';
      setErrorMsg(message);
      Alert.alert(
        testOutcome === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed',
        message
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Payment & Review" showBack onBackPress={() => router.back()} />
      <BookingStepper currentStep={4} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Simulated Demo Mode Banner */}
        <View style={styles.demoBanner}>
          <Ionicons name="shield-checkmark" size={16} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={styles.demoBannerTitle}>Simulated Development Payment System</Text>
            <Text style={styles.demoBannerSubtitle}>
              Safe demo environment. No real money, bank cards, or financial credentials are required or processed.
            </Text>
          </View>
        </View>

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

        {/* Dev Testing Controls for Simulation */}
        {__DEV__ && (
          <View style={styles.devControlBox}>
            <Text style={styles.devControlTitle}>🧪 Developer Simulation Controls</Text>
            <Text style={styles.devControlSubtitle}>Simulate different gateway responses:</Text>
            <View style={styles.devPillsRow}>
              {(['success', 'failure', 'cancelled'] as const).map((outcome) => (
                <TouchableOpacity
                  key={outcome}
                  activeOpacity={0.8}
                  onPress={() => setTestOutcome(outcome)}
                  style={[
                    styles.devPill,
                    testOutcome === outcome && styles.devPillActive,
                    outcome === 'failure' && testOutcome === outcome && styles.devPillFailure,
                    outcome === 'cancelled' && testOutcome === outcome && styles.devPillCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.devPillText,
                      testOutcome === outcome && styles.devPillTextActive,
                    ]}
                  >
                    {outcome === 'success' ? '🟢 Success' : outcome === 'failure' ? '🔴 Fail' : '🟡 Cancel'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Action Button */}
        <Button
          title={loading ? processingStage : `Confirm & Pay (₹${servicePrice})`}
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
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  demoBannerTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: '#065F46',
  },
  demoBannerSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 15,
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
  devControlBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  devControlTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: '#334155',
  },
  devControlSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginVertical: 4,
  },
  devPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  devPill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  devPillActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  devPillFailure: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  devPillCancelled: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  devPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  devPillTextActive: {
    fontWeight: '700',
    color: '#065F46',
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
