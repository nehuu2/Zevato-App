import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Spacing, BorderRadius, Elevation } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import AddressCard from '../../components/booking/AddressCard';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Address } from '../../types/user';

export default function AddressesScreen() {
  const router = useRouter();
  const { isLoaded, addresses, addAddress, setDefaultAddress } = useUserProfile();

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Haryana');
  const [pincode, setPincode] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddAddress = async () => {
    if (!street.trim() || !city.trim() || !pincode.trim()) {
      Alert.alert('Incomplete Address', 'Please fill in all address fields.');
      return;
    }

    try {
      setSaving(true);
      const newAddr: Address = {
        id: 'addr-' + Date.now(),
        label,
        street: street.trim(),
        city: city.trim(),
        state: stateName.trim() || 'Haryana',
        pincode: pincode.trim(),
        isDefault: addresses.length === 0,
      };

      await addAddress(newAddr);
      setShowAddForm(false);
      setStreet('');
      setCity('');
      setPincode('');
      Alert.alert('Success', 'Address saved to your profile.');
    } catch (err: any) {
      console.warn('Error saving address:', err);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.warn('Error setting default address:', err);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Saved Addresses" showBack onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading saved addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Saved Addresses" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 && !showAddForm ? (
          <EmptyState
            icon="location-outline"
            title="No Saved Addresses"
            description="Add your home or office address to book quick appliance repair visits."
            actionTitle="+ Add New Address"
            onActionPress={() => setShowAddForm(true)}
            style={styles.emptyBox}
          />
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onSelect={() => handleSetDefault(addr.id)}
              selected={addr.isDefault}
            />
          ))
        )}

        {showAddForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Delivery Address</Text>

            {/* Label Selector Pills */}
            <View style={styles.labelRow}>
              {(['Home', 'Work', 'Other'] as const).map((l) => (
                <Button
                  key={l}
                  title={l}
                  variant={label === l ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setLabel(l)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>

            <Input
              label="Street Address / Flat No."
              placeholder="e.g. Flat 101, Block A, Sunshine Heights"
              value={street}
              onChangeText={setStreet}
            />
            <Input
              label="City"
              placeholder="e.g. Gurugram / Delhi NCR"
              value={city}
              onChangeText={setCity}
            />
            <Input
              label="Pincode"
              placeholder="e.g. 122001"
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
            <View style={styles.formActions}>
              <Button
                title="Save Address"
                loading={saving}
                onPress={handleAddAddress}
                style={{ flex: 1 }}
              />
              <Button
                title="Cancel"
                variant="outline"
                disabled={saving}
                onPress={() => setShowAddForm(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : addresses.length > 0 ? (
          <Button
            title="+ Add New Address"
            variant="outline"
            onPress={() => setShowAddForm(true)}
            style={styles.addBtn}
          />
        ) : null}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyBox: {
    marginVertical: Spacing.lg,
  },
  addBtn: {
    marginTop: Spacing.sm,
  },
  formContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    ...Elevation.sm,
  },
  formTitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
