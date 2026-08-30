import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [street, setStreet] = useState('');

  const handleNext = () => {
    router.push('/(auth)/set-password');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Primary Address" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Where should we serve you?</Text>
        <Text style={styles.subheading}>
          Add your primary address to check service availability in your area.
        </Text>

        <Input
          label="House / Flat & Street"
          placeholder="e.g. Flat 402, Sunshine Heights, Sector 48"
          value={street}
          onChangeText={setStreet}
          leftIcon="home-outline"
        />

        <Input
          label="City"
          placeholder="e.g. Gurugram / Delhi NCR"
          value={city}
          onChangeText={setCity}
          leftIcon="business-outline"
        />

        <Input
          label="Pin Code"
          placeholder="e.g. 122001"
          keyboardType="number-pad"
          maxLength={6}
          value={pincode}
          onChangeText={setPincode}
          leftIcon="location-outline"
        />

        <Button
          title="Next: Set Security Password"
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
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.xl,
  },
  heading: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subheading: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
