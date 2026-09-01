import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';
import { useUserProfile } from '../../hooks/useUserProfile';
import { authStore } from '../../store/authStore';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { isLoaded, user, fullName, email, avatarUrl, completeProfile } = useUserProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [stateName, setStateName] = useState('Haryana');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate name from Clerk / Google profile
  useEffect(() => {
    if (isLoaded) {
      if (fullName && fullName !== 'Guest' && fullName !== 'User') {
        setName(fullName);
      }
    }
  }, [isLoaded, fullName]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!street.trim()) {
      errs.street = 'Street address / flat number is required';
    }

    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (!stateName.trim()) {
      errs.state = 'State is required';
    }

    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length < 5) {
      errs.pincode = 'Valid postal / PIN code is required';
    }

    if (!country.trim()) {
      errs.country = 'Country is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Incomplete Profile', 'Please check the required fields highlighted below.');
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const formattedPhone = phone.startsWith('+') ? phone.trim() : `+91 ${phone.trim()}`;

      await completeProfile({
        name: name.trim(),
        phone: formattedPhone,
        street: street.trim(),
        apartment: apartment.trim() || undefined,
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        country: country.trim(),
      });

      await authStore.setOnboardingCompleted(true);

      Alert.alert('Profile Complete', 'Your details have been saved successfully!', [
        {
          text: "Let's Get Started",
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (err: any) {
      console.warn('Profile completion error:', err);
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Unable to save your profile details. Please check your network connection.';
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing account profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Complete Profile"
        subtitle="One quick step to activate service"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Welcome Card */}
          <View style={styles.heroCard}>
            <View style={styles.avatarRow}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImg}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={26} color={Colors.white} />
                </View>
              )}
              <View style={styles.heroTextContainer}>
                <Text style={styles.welcomeHeading}>
                  Welcome, {name ? name.split(' ')[0] : 'there'}! 👋
                </Text>
                <Text style={styles.welcomeSub}>
                  Google authenticated. Please add your contact phone and doorstep address to proceed.
                </Text>
              </View>
            </View>
          </View>

          {/* Form Error Banner */}
          {errors.form ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.danger} />
              <Text style={styles.errorBannerText}>{errors.form}</Text>
            </View>
          ) : null}

          {/* Section 1: Basic Information */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>1. Personal Contact Details</Text>

            <Input
              label="Full Name *"
              placeholder="e.g. your full name"
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              leftIcon="person-outline"
              error={errors.name}
            />

            <Input
              label="Email Address (Google Account)"
              value={email || user?.primaryEmailAddress?.emailAddress || ''}
              editable={false}
              leftIcon="mail-outline"
              rightIcon="checkmark-circle"
              containerStyle={styles.disabledInput}
              helperText="Verified via Google authentication"
            />

            <Input
              label="Mobile Phone Number *"
              placeholder="e.g. 98765 43210"
              value={phone}
              onChangeText={(val) => {
                setPhone(val);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              keyboardType="phone-pad"
              maxLength={14}
              leftIcon="call-outline"
              error={errors.phone}
              helperText="Required for technician arrival updates and OTP verification"
            />
          </View>

          {/* Section 2: Primary Service Address */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>2. Primary Doorstep Address</Text>
            <Text style={styles.sectionSub}>
              Where should our certified technician arrive for repairs and inspection?
            </Text>

            <Input
              label="House / Flat / Street Address *"
              placeholder="e.g. Flat 402, Sunshine Heights, Main Road"
              value={street}
              onChangeText={(val) => {
                setStreet(val);
                if (errors.street) setErrors((prev) => ({ ...prev, street: '' }));
              }}
              leftIcon="home-outline"
              error={errors.street}
            />

            <Input
              label="Apartment, Tower or Landmark (Optional)"
              placeholder="e.g. Near HDFC Bank / Tower B"
              value={apartment}
              onChangeText={setApartment}
              leftIcon="business-outline"
            />

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Input
                  label="City *"
                  placeholder="e.g. Gurugram"
                  value={city}
                  onChangeText={(val) => {
                    setCity(val);
                    if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                  }}
                  leftIcon="map-outline"
                  error={errors.city}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="State *"
                  placeholder="e.g. Haryana"
                  value={stateName}
                  onChangeText={(val) => {
                    setStateName(val);
                    if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                  }}
                  leftIcon="compass-outline"
                  error={errors.state}
                />
              </View>
            </View>

            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Input
                  label="Postal / PIN Code *"
                  placeholder="e.g. 122001"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={(val) => {
                    setPincode(val);
                    if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: '' }));
                  }}
                  leftIcon="location-outline"
                  error={errors.pincode}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Country *"
                  placeholder="e.g. India"
                  value={country}
                  onChangeText={(val) => {
                    setCountry(val);
                    if (errors.country) setErrors((prev) => ({ ...prev, country: '' }));
                  }}
                  leftIcon="globe-outline"
                  error={errors.country}
                />
              </View>
            </View>
          </View>

          {/* Privacy Guarantee Note */}
          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
            <Text style={styles.privacyNoteText}>
              Your information is securely encrypted and used exclusively for doorstep service delivery.
            </Text>
          </View>

          <Button
            title="Complete & Continue to App"
            loading={loading}
            onPress={handleSubmit}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
            style={styles.submitBtn}
          />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarImg: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  welcomeHeading: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  welcomeSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorBannerText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  disabledInput: {
    opacity: 0.9,
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  privacyNoteText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryDark,
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
});
