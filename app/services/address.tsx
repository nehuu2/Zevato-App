import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import EmptyState from '../../components/common/EmptyState';
import { bookingStore } from '../../store/bookingStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Address } from '../../types/user';

export default function AddressScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const { isLoaded, addresses, addAddress } = useUserProfile();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    draft.address?.id || addresses[0]?.id || ''
  );

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def.id);
      bookingStore.setAddress(def);
    }
  }, [addresses, selectedAddressId]);

  // New Address Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [pincode, setPincode] = useState('122001');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveNewAddress = async () => {
    if (!street.trim()) {
      setFormError('Please enter street address / building name.');
      return;
    }
    if (!pincode.trim() || pincode.length < 6) {
      setFormError('Please enter a valid 6-digit PIN code.');
      return;
    }

    try {
      setSaving(true);
      const newAddr: Address = {
        id: 'addr-' + Date.now(),
        label,
        street: street.trim(),
        city: city.trim() || 'Gurugram',
        state: 'Haryana',
        pincode: pincode.trim(),
        isDefault: addresses.length === 0,
      };

      await addAddress(newAddr);
      setSelectedAddressId(newAddr.id);
      bookingStore.setAddress(newAddr);

      // Reset form
      setStreet('');
      setFormError(null);
      setShowAddModal(false);
    } catch (err) {
      console.warn('Error saving address:', err);
      setFormError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    if (!selected) {
      Alert.alert('Address Required', 'Please add or select a service delivery address.');
      setShowAddModal(true);
      return;
    }
    bookingStore.setAddress(selected);
    router.push('/services/payment');
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Service Address" showBack onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

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

        {addresses.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="No Saved Address"
            description="Please add your address so our certified technician can reach your doorstep."
            actionTitle="+ Add Service Address"
            onActionPress={() => setShowAddModal(true)}
            style={styles.emptyBox}
          />
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={addr.id === selectedAddressId}
              onSelect={() => {
                setSelectedAddressId(addr.id);
                bookingStore.setAddress(addr);
              }}
            />
          ))
        )}

        {addresses.length > 0 && (
          <Button
            title="+ Add Another Address"
            variant="outline"
            size="md"
            leftIcon={<Ionicons name="location-outline" size={16} color={Colors.primary} />}
            onPress={() => setShowAddModal(true)}
            style={styles.addBtn}
          />
        )}

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
              placeholder="e.g. Flat 101, Block A, Sunshine Heights"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.cityPincodeRow}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Input
                  label="City"
                  value={city}
                  placeholder="e.g. Gurugram"
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
              loading={saving}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyBox: {
    marginVertical: Spacing.md,
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
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  modalLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tagPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tagPillSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
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
