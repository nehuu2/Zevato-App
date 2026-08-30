import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone || phone.length < 10) errs.phone = 'Valid 10-digit mobile number required';
    if (email && !email.includes('@')) errs.email = 'Valid email address required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    router.push('/(auth)/complete-profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Create Account" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Join Zevota Care</Text>
        <Text style={styles.subheading}>
          Get started with express appliance servicing and repairs.
        </Text>

        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          leftIcon="person-outline"
          error={errors.name}
        />

        <Input
          label="Mobile Number"
          placeholder="98765 43210"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(text) => {
            setPhone(text.replace(/[^0-9]/g, ''));
            if (errors.phone) setErrors({ ...errors, phone: '' });
          }}
          leftIcon="call-outline"
          error={errors.phone}
        />

        <Input
          label="Email Address (Optional)"
          placeholder="name@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          leftIcon="mail-outline"
          error={errors.email}
        />

        <Button
          title="Continue"
          loading={loading}
          onPress={handleNext}
          style={styles.submitBtn}
        />

        <Text style={styles.loginPrompt}>
          Already have an account?{' '}
          <Text style={styles.linkText} onPress={() => router.push('/(auth)/login')}>
            Log In
          </Text>
        </Text>
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
  loginPrompt: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
