import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { Product } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    productId?: string;
    categoryId?: string;
    brandId?: string;
  }>();

  const draft = bookingStore.getState();
  const targetProductId = params.productId || draft.product?.id;

  const foundProduct = products.find((p) => p.id === targetProductId);
  const product: Product = foundProduct || draft.product || {
    id: targetProductId || 'p-ac-1',
    name: '1.5 Ton 5 Star Split Inverter AC',
    model: 'FTKF50TV',
    description: 'High efficiency dual inverter cooling system with copper coil condenser.',
    categoryId: params.categoryId || draft.category?.id || 'ac',
    brandId: params.brandId || draft.brand?.id || 'daikin',
  };

  const categoryObj = categories.find((c) => c.id === product.categoryId) || draft.category;
  const brandObj = brands.find((b) => b.id === product.brandId) || draft.brand;

  const handleContinue = () => {
    bookingStore.setProduct(product);
    if (categoryObj) bookingStore.setCategory(categoryObj);
    if (brandObj) bookingStore.setBrand(brandObj);

    router.push({
      pathname: '/services/service-details',
      params: {
        productId: product.id,
        categoryId: product.categoryId,
        brandId: product.brandId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Product Details"
        subtitle={`${brandObj?.name || ''} ${categoryObj?.name || ''}`.trim()}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Visual Box */}
        <View style={styles.heroBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="cube" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          {product.model ? (
            <View style={styles.modelPill}>
              <Ionicons name="pricetag-outline" size={12} color={Colors.primary} />
              <Text style={styles.modelText}>Model: {product.model}</Text>
            </View>
          ) : null}
          <View style={styles.badgeRow}>
            <View style={styles.brandTag}>
              <Text style={styles.brandTagText}>{brandObj?.name || 'Verified Brand'}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{categoryObj?.name || 'Appliance'}</Text>
            </View>
          </View>
        </View>

        {/* Overview & Description Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Appliance Overview</Text>
          <Text style={styles.descText}>{product.description}</Text>

          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
              <View>
                <Text style={styles.specLabel}>Warranty Protection</Text>
                <Text style={styles.specVal}>30-Day Free Revisit</Text>
              </View>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="ribbon" size={18} color={Colors.primary} />
              <View>
                <Text style={styles.specLabel}>Spare Parts</Text>
                <Text style={styles.specVal}>100% Genuine OEM</Text>
              </View>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="time" size={18} color="#D97706" />
              <View>
                <Text style={styles.specLabel}>Service Turnaround</Text>
                <Text style={styles.specVal}>Within 2 Hours</Text>
              </View>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="people" size={18} color="#7C3AED" />
              <View>
                <Text style={styles.specLabel}>Technician</Text>
                <Text style={styles.specVal}>Certified Specialist</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Why Choose Us Highlight */}
        <View style={styles.highlightCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
          <Text style={styles.highlightText}>
            Fixed pricing rate card applies. No hidden diagnostic fees upon technician arrival.
          </Text>
        </View>

        <Button
          title="View Available Service Packages"
          onPress={handleContinue}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
          style={styles.ctaBtn}
        />
        <View style={{ height: 24 }} />
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
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  productName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  modelText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  brandTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  brandTagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryTagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Elevation.sm,
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
  specsGrid: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  specLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  specVal: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 1,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.infoLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  highlightText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.info,
    fontWeight: '600',
    lineHeight: 16,
  },
  ctaBtn: {
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
