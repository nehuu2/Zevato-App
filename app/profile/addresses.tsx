import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Spacing, BorderRadius, Elevation } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Address } from '../../types/user';

export default function AddressesScreen() {
  const router = useRouter();
  const { isLoaded, addresses, addAddress, setDefaultAddress, removeAddress } = useUserProfile();

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [stateName, setStateName] = useState('Haryana');
  const [pincode, setPincode] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddAddress = async () => {
    if (!street.trim()) {
      Alert.alert('Incomplete Address', 'Please enter your street address or building name.');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Incomplete Address', 'Please enter your city.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      Alert.alert('Incomplete Address', 'Please enter a valid 6-digit PIN code.');
      return;
    }

    try {
      setSaving(true);
      const newAddr: Address = {
        id: 'addr-' + Date.now(),
        label,
        street: street.trim(),
        apartment: apartment.trim() || undefined,
        city: city.trim(),
        state: stateName.trim() || 'Haryana',
        pincode: pincode.trim(),
        country: 'India',
        isDefault: addresses.length === 0,
      };

      await addAddress(newAddr);
      setShowAddForm(false);
      setStreet('');
      setApartment('');
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

  const handleDeleteAddress = (addr: Address) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to remove "${addr.street}, ${addr.city}" from your saved addresses?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeAddress(addr.id);
            } catch (err) {
              console.warn('Error removing address:', err);
              Alert.alert('Error', 'Failed to delete address.');
            }
          },
        },
      ]
    );
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
          addresses.map((addr) => {
            const isDefault = Boolean(addr.isDefault);
            return (
              <View key={addr.id} style={[styles.addrCard, isDefault && styles.addrCardDefault]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.labelBadge}>
                    <Ionicons
                      name={
                        addr.label === 'Work'
                          ? 'briefcase-outline'
                          : addr.label === 'Other'
                          ? 'location-outline'
                          : 'home-outline'
                      }
                      size={14}
                      color={isDefault ? Colors.primaryDark : Colors.textSecondary}
                    />
                    <Text style={[styles.labelBadgeText, isDefault && styles.labelBadgeTextDefault]}>
                      {addr.label || 'Home'}
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    {isDefault ? (
                      <View style={styles.defaultPill}>
                        <Text style={styles.defaultPillText}>Default</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSetDefault(addr.id)}
                        style={styles.setDefaultBtn}
                      >
                        <Text style={styles.setDefaultText}>Set as Default</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDeleteAddress(addr)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.streetText}>
                  {addr.street}
                  {addr.apartment ? `, ${addr.apartment}` : ''}
                </Text>
                <Text style={styles.cityStateText}>
                  {addr.city}, {addr.state || 'Haryana'} - {addr.pincode}
                </Text>
              </View>
            );
          })
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
              label="Flat / House / Street Address"
              placeholder="e.g. Flat 101, Block A, Sunshine Heights"
              value={street}
              onChangeText={setStreet}
            />
            <Input
              label="Apartment / Landmark (Optional)"
              placeholder="e.g. Near Community Center"
              value={apartment}
              onChangeText={setApartment}
            />
            <View style={styles.cityPincodeRow}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Input
                  label="City"
                  placeholder="e.g. Gurugram"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="PIN Code"
                  placeholder="122001"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>

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
  addrCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  addrCardDefault: {
    borderColor: Colors.primary,
    backgroundColor: '#F8FAFC',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs + 2,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  labelBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  labelBadgeTextDefault: {
    color: Colors.primaryDark,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  defaultPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  defaultPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  setDefaultBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  setDefaultText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteBtn: {
    padding: 4,
  },
  streetText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
  },
  cityStateText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
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
  cityPincodeRow: {
    flexDirection: 'row',
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
