import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';

export default function SetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleFinish = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    router.push('/(auth)/account-created');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Set Password" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Secure Your Account</Text>
        <Text style={styles.subheading}>
          Create a secure password for quick future log ins.
        </Text>

        <Input
          label="Password"
          placeholder="Enter password"
          isPassword
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed-outline"
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm password"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon="lock-closed-outline"
          error={error}
        />

        <Button
          title="Create Account"
          onPress={handleFinish}
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
