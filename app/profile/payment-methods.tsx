import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import { useUserProfile } from '../../hooks/useUserProfile';
import { PaymentMethod } from '../../types/user';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { isLoaded, paymentMethods, addPaymentMethod } = useUserProfile();

  const [showAddForm, setShowAddForm] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddUPI = async () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g., yourname@okaxis).');
      return;
    }

    try {
      setSaving(true);
      const newPm: PaymentMethod = {
        id: 'pm-' + Date.now(),
        type: 'upi',
        title: 'UPI - ' + upiId.trim(),
        subtitle: upiId.trim(),
        isDefault: paymentMethods.length === 0,
      };

      await addPaymentMethod(newPm);
      setUpiId('');
      setShowAddForm(false);
      Alert.alert('Success', 'Payment method saved to profile.');
    } catch (err) {
      console.warn('Error saving payment method:', err);
      Alert.alert('Error', 'Failed to save payment method.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Payment Methods" showBack onBackPress={() => router.back()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Payment Methods" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Payment Options</Text>

        {paymentMethods.length === 0 && !showAddForm ? (
          <EmptyState
            icon="card-outline"
            title="No Saved Payment Methods"
            description="You can pay securely via UPI, Credit/Debit card, or Cash on Service during checkout."
            actionTitle="+ Add UPI / Card"
            onActionPress={() => setShowAddForm(true)}
            style={styles.emptyBox}
          />
        ) : (
          paymentMethods.map((pm) => (
            <View key={pm.id} style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={
                    pm.type === 'upi'
                      ? 'qr-code-outline'
                      : pm.type === 'card'
                      ? 'card-outline'
                      : 'cash-outline'
                  }
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{pm.title}</Text>
                {pm.subtitle && <Text style={styles.subtitle}>{pm.subtitle}</Text>}
              </View>
              {pm.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
          ))
        )}

        {showAddForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add UPI ID</Text>
            <Input
              label="Virtual Payment Address (VPA)"
              placeholder="e.g. mobile@okaxis or user@okhdfcbank"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              leftIcon="qr-code-outline"
            />
            <View style={styles.formActions}>
              <Button
                title="Save Method"
                loading={saving}
                onPress={handleAddUPI}
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
        ) : paymentMethods.length > 0 ? (
          <Button
            title="+ Add New Payment Method"
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
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.sm,
  },
  emptyBox: {
    marginVertical: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBtn: {
    marginTop: Spacing.md,
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
  formActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
