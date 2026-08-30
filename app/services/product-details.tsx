import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { bookingStore } from '../../store/bookingStore';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();
  const product = draft.product || {
    id: 'p-1',
    name: '1.5 Ton Split Inverter AC',
    description: 'High efficiency dual-inverter cooling system.',
    categoryId: 'ac',
    brandId: 'daikin',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Product Details" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBox}>
          <Ionicons name="cube" size={64} color={Colors.primary} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{draft.brand?.name || 'Brand Verified'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.descText}>{product.description}</Text>

          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Category</Text>
              <Text style={styles.specVal}>{draft.category?.name || 'Air Conditioner'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Support</Text>
              <Text style={styles.specVal}>Doorstep Expert</Text>
            </View>
          </View>
        </View>

        <Button
          title="View Available Services"
          onPress={() => router.push('/services/service-details')}
          style={styles.ctaBtn}
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
  heroBox: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  productName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  productBrand: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  descText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  specsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  specVal: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  ctaBtn: {
    marginTop: Spacing.sm,
  },
});
