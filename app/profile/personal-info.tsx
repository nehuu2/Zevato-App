import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing, BorderRadius, Elevation } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, fullName, email, phone, updateProfile } = useUserProfile();

  const [name, setName] = useState(fullName);
  const [userPhone, setUserPhone] = useState(phone);
  const [saving, setSaving] = useState(false);

  // Sync state when Clerk user finishes loading
  useEffect(() => {
    if (isLoaded) {
      setName(fullName === 'Guest' || fullName === 'User' ? '' : fullName);
      setUserPhone(phone);
    }
  }, [isLoaded, fullName, phone]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        fullName: name.trim(),
        phone: userPhone.trim(),
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.warn('Update profile error:', err);
      const errorMsg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Update Failed', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Personal Information" showBack onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Personal Information" showBack onBackPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Full Name"
          placeholder="e.g. your full name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />

        <Input
          label="Mobile Phone"
          placeholder="e.g. +91 98765 00000"
          value={userPhone}
          onChangeText={setUserPhone}
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />

        <Input
          label="Email Address"
          value={email || 'Not provided'}
          editable={false}
          leftIcon="mail-outline"
          containerStyle={styles.disabledInput}
          helperText="Managed securely via your authentication provider"
        />

        <Button
          title="Save Changes"
          loading={saving}
          onPress={handleSave}
          style={styles.saveBtn}
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
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.md,
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
  disabledInput: {
    opacity: 0.85,
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
});
