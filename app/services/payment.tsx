import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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
  { id: 'cod', title: 'Pay on Service Completion', subtitle: 'Cash or UPI after inspection', icon: 'cash-outline' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const draft = bookingStore.getState();

  const servicePrice = draft.service?.price || 499;

  const handleConfirmBooking = async () => {
    setLoading(true);
    bookingStore.setPaymentMethod(selectedMethod);
    // Simulate booking creation
    setTimeout(() => {
      setLoading(false);
      router.replace('/services/booking-confirmed');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Payment & Review" showBack onBackPress={() => router.back()} />
      <BookingStepper currentStep={4} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.paymentList}>
          {paymentOptions.map((opt) => {
            const isSelected = opt.id === selectedMethod;
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

        <PaymentSummary
          itemTotal={servicePrice}
          discount={0}
          visitingFee={0}
          isMember={true}
        />

        <Button
          title={`Confirm Booking (₹${servicePrice})`}
          loading={loading}
          onPress={handleConfirmBooking}
          style={styles.submitBtn}
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
  scrollContent: {
    padding: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  paymentList: {
    marginBottom: Spacing.md,
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
  submitBtn: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
