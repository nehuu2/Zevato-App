import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ServiceOption from '../../components/services/ServiceOption';
import ServiceFeature from '../../components/services/ServiceFeature';
import { serviceOptions, serviceFeatures } from '../../data/services';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { ServiceOption as ServiceOptionType } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    categoryId?: string;
    productId?: string;
    brandId?: string;
  }>();

  const draft = bookingStore.getState();
  const categoryId = params.categoryId || draft.category?.id || 'ac';
  const categoryObj = categories.find((c) => c.id === categoryId) || draft.category;
  const productObj = products.find((p) => p.id === params.productId) || draft.product;

  const availableOptions = serviceOptions[categoryId] || serviceOptions['ac'] || [];

  const [selectedOption, setSelectedOption] = useState<ServiceOptionType>(
    draft.service && availableOptions.some((o) => o.id === draft.service?.id)
      ? draft.service
      : availableOptions[0]
  );

  useEffect(() => {
    if (availableOptions.length > 0 && (!selectedOption || !availableOptions.some((o) => o.id === selectedOption.id))) {
      setSelectedOption(availableOptions[0]);
    }
  }, [categoryId, availableOptions]);

  const handleProceed = () => {
    if (selectedOption) {
      bookingStore.setService(selectedOption);
    }
    router.push('/services/schedule');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Service Package"
        subtitle={productObj?.name || categoryObj?.name || 'Appliance Service'}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Options List */}
        <Text style={styles.sectionHeader}>Available Packages & Repairs</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the service package that fits your appliance requirements:
        </Text>

        {availableOptions.map((opt) => (
          <ServiceOption
            key={opt.id}
            option={opt}
            selected={selectedOption?.id === opt.id}
            onSelect={(selected) => setSelectedOption(selected)}
          />
        ))}

        {/* Zevota Care Guarantee */}
        <Text style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
          The Zevota Care Guarantee
        </Text>
        <Text style={styles.sectionSubtitle}>
          Every booking includes our standardized service assurances:
        </Text>

        {serviceFeatures.map((feat) => (
          <ServiceFeature key={feat.id} feature={feat} />
        ))}
      </ScrollView>

      {/* Floating Sticky Bottom Bar */}
      {selectedOption ? (
        <View style={styles.bottomBar}>
          <View style={styles.priceInfo}>
            <Text style={styles.totalLabel}>Selected Package</Text>
            <Text style={styles.totalPrice}>₹{selectedOption.price}</Text>
            <Text style={styles.packageDuration}>{selectedOption.duration}</Text>
          </View>
          <Button
            title="Continue to Schedule"
            size="md"
            onPress={handleProceed}
            style={styles.continueBtn}
          />
        </View>
      ) : null}
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
    paddingBottom: 110,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
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
  packageDuration: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  continueBtn: {
    paddingHorizontal: Spacing.lg,
  },
});
