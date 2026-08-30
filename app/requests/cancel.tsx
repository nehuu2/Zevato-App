import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const reasons = [
  'Technician took too long to arrive',
  'Issue resolved by myself',
  'Price higher than expected',
  'Booked by mistake',
  'Other reason',
];

export default function CancelRequestScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState(reasons[0]);
  const [customFeedback, setCustomFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmCancel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Request Cancelled', 'Your service request has been cancelled.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/requests') },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Cancel Service Request" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Reason for Cancellation</Text>
        <Text style={styles.subtitle}>
          Please let us know why you would like to cancel this request:
        </Text>

        <View style={styles.reasonsList}>
          {reasons.map((r) => {
            const isSelected = r === selectedReason;
            return (
              <TouchableOpacity
                key={r}
                activeOpacity={0.8}
                onPress={() => setSelectedReason(r)}
                style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Colors.danger : Colors.borderDark}
                />
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedReason === 'Other reason' && (
          <Input
            placeholder="Tell us more about the issue..."
            multiline
            numberOfLines={3}
            value={customFeedback}
            onChangeText={setCustomFeedback}
          />
        )}

        <Button
          title="Confirm Cancellation"
          variant="danger"
          loading={loading}
          onPress={handleConfirmCancel}
          style={styles.submitBtn}
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
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  reasonsList: {
    marginBottom: Spacing.md,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonItemSelected: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  reasonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  reasonTextSelected: {
    color: Colors.danger,
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
