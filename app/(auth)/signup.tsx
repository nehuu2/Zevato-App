import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/expo/legacy';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { authStore } from '../../store/authStore';

export default function SignupScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  // Step 1: Create Clerk Account with Email & Password
  const handleSignUp = async () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!isLoaded || !signUp) {
      setErrors({ form: 'Authentication service is initializing. Please wait...' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || undefined;

      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName,
        lastName,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.warn('Sign Up error:', err);
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Unable to create account. Please check your information.';
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP Code
  const handleVerifyEmail = async () => {
    if (!code || code.length < 4) {
      setErrors({ code: 'Please enter the verification code sent to your email.' });
      return;
    }

    if (!isLoaded || !signUp) return;

    try {
      setLoading(true);
      setErrors({});

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === 'complete') {
        if (setActive) {
          await setActive({ session: completeSignUp.createdSessionId });
        }
        await authStore.setOnboardingCompleted(true);
        router.replace('/(tabs)/home');
      } else {
        console.log('Verification status:', completeSignUp.status);
        setErrors({ code: 'Verification incomplete. Please check the code.' });
      }
    } catch (err: any) {
      console.warn('Verification error:', err);
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Invalid verification code. Please try again.';
      setErrors({ code: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top App Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle}>Create Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {pendingVerification ? (
            /* Email Verification Step */
            <View style={styles.verificationContainer}>
              <View style={styles.verifyIconBox}>
                <Ionicons name="mail-open-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.heading}>Verify Your Email</Text>
              <Text style={styles.subheading}>
                We sent a 6-digit verification code to{' '}
                <Text style={{ fontWeight: '700', color: Colors.text }}>{email}</Text>
              </Text>

              {errors.code ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={Colors.danger} />
                  <Text style={styles.errorBannerText}>{errors.code}</Text>
                </View>
              ) : null}

              <Input
                label="Verification Code"
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (errors.code) setErrors({ ...errors, code: '' });
                }}
                leftIcon="key-outline"
              />

              <Button
                title="Verify & Complete Sign Up"
                loading={loading}
                onPress={handleVerifyEmail}
                style={styles.submitBtn}
              />

              <Button
                title="Change Email"
                variant="ghost"
                onPress={() => setPendingVerification(false)}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          ) : (
            /* Registration View */
            <>
              <View style={styles.heroSection}>
                <View style={styles.shieldBadge}>
                  <Ionicons name="shield-checkmark" size={38} color={Colors.primary} />
                </View>
                <Text style={styles.heading}>Join Zevato Care</Text>
                <Text style={styles.subheading}>
                  Create an account to access protection plans, fast repairs & live tracking
                </Text>
              </View>

              {errors.form ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={Colors.danger} />
                  <Text style={styles.errorBannerText}>{errors.form}</Text>
                </View>
              ) : null}

              <View style={styles.formContainer}>
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
                  label="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  leftIcon="mail-outline"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Create a secure password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  isPassword
                  leftIcon="lock-closed-outline"
                  error={errors.password}
                />

                <Input
                  label="Mobile Phone (Optional)"
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

                <Button
                  title="Create Account"
                  loading={loading}
                  onPress={handleSignUp}
                  style={styles.submitBtn}
                />

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Sign Up: Google */}
                <GoogleSignInButton
                  buttonText="Continue with Google"
                  onSuccess={() => router.replace('/(tabs)/home')}
                />
              </View>

              {/* Clerk Bot Protection Mount */}
              <View nativeID="clerk-captcha" />

              <View style={styles.footer}>
                <Text style={styles.loginPrompt}>
                  Already have an account?{' '}
                  <Text style={styles.linkText} onPress={() => router.push('/(auth)/login')}>
                    Sign In
                  </Text>
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  shieldBadge: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subheading: {
    fontSize: Typography.fontSize.sm,
    color: '#64748B',
    marginBottom: Spacing.sm,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 290,
  },
  formContainer: {
    marginBottom: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: Typography.fontSize.xs,
    color: '#94A3B8',
    marginHorizontal: Spacing.md,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    ...Elevation.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  loginPrompt: {
    fontSize: Typography.fontSize.sm,
    color: '#64748B',
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  verificationContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  verifyIconBox: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
});
