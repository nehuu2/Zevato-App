import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ServiceOption from '../../components/services/ServiceOption';
import ServiceFeature from '../../components/services/ServiceFeature';
import { serviceOptions, serviceFeatures } from '../../data/services';
import { ServiceOption as ServiceOptionType } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const categoryKey = draft.category?.id || 'ac';
  const availableOptions = serviceOptions[categoryKey] || serviceOptions['ac'];

  const [selectedOption, setSelectedOption] = useState<ServiceOptionType>(
    draft.service || availableOptions[0]
  );

  const handleProceed = () => {
    bookingStore.setService(selectedOption);
    router.push('/services/schedule');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Service Package"
        subtitle={draft.category?.name || 'Air Conditioner'}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Available Packages</Text>
        {availableOptions.map((opt) => (
          <ServiceOption
            key={opt.id}
            option={opt}
            selected={selectedOption.id === opt.id}
            onSelect={(selected) => setSelectedOption(selected)}
          />
        ))}

        <Text style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
          The Zevota Care Guarantee
        </Text>
        {serviceFeatures.map((feat) => (
          <ServiceFeature key={feat.id} feature={feat} />
        ))}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Selected Package</Text>
          <Text style={styles.totalPrice}>₹{selectedOption.price}</Text>
        </View>
        <Button
          title="Continue to Schedule"
          size="md"
          onPress={handleProceed}
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 90,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Elevation.lg,
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  continueBtn: {
    paddingHorizontal: Spacing.lg,
  },
});
