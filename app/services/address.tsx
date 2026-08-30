import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import BookingStepper from '../../components/booking/BookingStepper';
import AddressCard from '../../components/booking/AddressCard';
import { userStore } from '../../store/userStore';
import { bookingStore } from '../../store/bookingStore';
import { Address } from '../../types/user';

export default function AddressScreen() {
  const router = useRouter();
  const addresses = userStore.getState().addresses;
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || 'addr-1'
  );

  const handleNext = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    bookingStore.setAddress(selected);
    router.push('/services/payment');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Service Address" showBack onBackPress={() => router.back()} />
      <BookingStepper currentStep={3} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Select Service Location</Text>

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={addr.id === selectedAddressId}
            onSelect={() => setSelectedAddressId(addr.id)}
          />
        ))}

        <Button
          title="+ Add New Address"
          variant="outline"
          size="md"
          onPress={() => router.push('/profile/addresses')}
          style={styles.addBtn}
        />

        <Button
          title="Proceed to Payment"
          onPress={handleNext}
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
    marginBottom: Spacing.md,
  },
  addBtn: {
    marginVertical: Spacing.sm,
    borderColor: Colors.borderDark,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
