import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import BookingStepper from '../../components/booking/BookingStepper';
import AddressCard from '../../components/booking/AddressCard';
import { userStore } from '../../store/userStore';
import { bookingStore } from '../../store/bookingStore';
import { Address } from '../../types/user';

export default function AddressScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const userAddresses = userStore.getState().addresses;

  const [addresses, setAddresses] = useState<Address[]>(userAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    draft.address?.id || addresses[0]?.id || 'addr-1'
  );

  // New Address Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [pincode, setPincode] = useState('122001');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSaveNewAddress = () => {
    if (!street.trim()) {
      setFormError('Please enter street address / building name.');
      return;
    }
    if (!pincode.trim() || pincode.length < 6) {
      setFormError('Please enter a valid 6-digit PIN code.');
      return;
    }

    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      label: label as 'Home' | 'Work' | 'Other',
      street: street.trim(),
      city: city.trim(),
      state: 'Haryana',
      pincode: pincode.trim(),
      isDefault: false,
    };

    userStore.addAddress(newAddr);
    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    bookingStore.setAddress(newAddr);

    // Reset form
    setStreet('');
    setFormError(null);
    setShowAddModal(false);
  };

  const handleNext = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    if (!selected) {
      return;
    }
    bookingStore.setAddress(selected);
    router.push('/services/payment');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Service Address"
        subtitle="Where should our technician arrive?"
        showBack
        onBackPress={() => router.back()}
      />
      <BookingStepper currentStep={3} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAddModal(true)}
            style={styles.addNewInlineBtn}
          >
            <Ionicons name="add-circle" size={16} color={Colors.primary} />
            <Text style={styles.addNewInlineText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={addr.id === selectedAddressId}
            onSelect={() => setSelectedAddressId(addr.id)}
          />
        ))}

        <Button
          title="+ Add Another Address"
          variant="outline"
          size="md"
          leftIcon={<Ionicons name="location-outline" size={16} color={Colors.primary} />}
          onPress={() => setShowAddModal(true)}
          style={styles.addBtn}
        />

        {/* Security badge */}
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={styles.verifiedText}>
            Technicians are GPS tracked and strictly background verified.
          </Text>
        </View>

        <Button
          title="Proceed to Payment"
          onPress={handleNext}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
          style={styles.submitBtn}
        />
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add New Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Service Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Address Type Selector */}
            <Text style={styles.modalLabel}>Address Tag</Text>
            <View style={styles.tagRow}>
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setLabel(t)}
                  style={[styles.tagPill, label === t && styles.tagPillSelected]}
                >
                  <Text style={[styles.tagText, label === t && styles.tagTextSelected]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Flat / House / Street Address"
              placeholder="e.g. Flat 302, Rosewood Tower, Sector 48"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.cityPincodeRow}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Input
                  label="City"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="PIN Code"
                  placeholder="122001"
                  keyboardType="numeric"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>

            {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

            <Button
              title="Save & Select Address"
              onPress={handleSaveNewAddress}
              style={styles.saveModalBtn}
            />
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  addNewInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addNewInlineText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBtn: {
    marginVertical: Spacing.sm,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.white,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  verifiedText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    ...Elevation.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  modalLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tagPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.surface,
  },
  tagPillSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagTextSelected: {
    color: Colors.white,
  },
  cityPincodeRow: {
    flexDirection: 'row',
  },
  formErrorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    marginBottom: Spacing.sm,
  },
  saveModalBtn: {
    marginTop: Spacing.sm,
  },
});
