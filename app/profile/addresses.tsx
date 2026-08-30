import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import AddressCard from '../../components/booking/AddressCard';
import Input from '../../components/common/Input';
import { userStore } from '../../store/userStore';

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState(userStore.getState().addresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleAddAddress = () => {
    if (!street || !city || !pincode) {
      Alert.alert('Incomplete', 'Please fill in all address fields.');
      return;
    }
    const newAddr = {
      id: 'addr-' + Date.now(),
      label,
      street,
      city,
      state: 'Haryana',
      pincode,
    };
    userStore.addAddress(newAddr);
    setAddresses(userStore.getState().addresses);
    setShowAddForm(false);
    setStreet('');
    setCity('');
    setPincode('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Saved Addresses" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onSelect={() => userStore.setDefaultAddress(addr.id)}
            selected={addr.isDefault}
          />
        ))}

        {showAddForm ? (
          <View style={styles.formContainer}>
            <Input
              label="Street Address / Flat No."
              placeholder="e.g. Flat 101, Sunshine Block"
              value={street}
              onChangeText={setStreet}
            />
            <Input
              label="City"
              placeholder="e.g. Gurugram"
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
                onPress={handleAddAddress}
                style={{ flex: 1 }}
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowAddForm(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <Button
            title="+ Add New Address"
            variant="outline"
            onPress={() => setShowAddForm(true)}
            style={styles.addBtn}
          />
        )}
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
  addBtn: {
    marginTop: Spacing.sm,
  },
  formContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
