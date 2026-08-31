import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/services/ProductCard';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { Product } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string; brandId?: string }>();
  const draft = bookingStore.getState();

  const categoryId = params.categoryId || draft.category?.id;
  const brandId = params.brandId || draft.brand?.id;

  const categoryObj = categories.find((c) => c.id === categoryId) || draft.category;
  const brandObj = brands.find((b) => b.id === brandId) || draft.brand;

  // Filter products matching category and brand
  const filteredProducts = products.filter((p) => {
    const matchCat = categoryId ? p.categoryId === categoryId : true;
    const matchBrand = brandId ? p.brandId === brandId : true;
    return matchCat && matchBrand;
  });

  const handleSelectProduct = (product: Product) => {
    bookingStore.setProduct(product);
    router.push({
      pathname: '/services/product-details',
      params: {
        productId: product.id,
        categoryId: product.categoryId || categoryId,
        brandId: product.brandId || brandId,
      },
    });
  };

  const handleGenericSelect = () => {
    const genericProduct: Product = {
      id: `p-gen-${categoryId}-${brandId}`,
      name: `Standard ${brandObj?.name || ''} ${categoryObj?.name || 'Appliance'}`,
      categoryId: categoryId || 'ac',
      brandId: brandId || 'generic',
      model: 'Standard Model',
      description: `Standard diagnostic and servicing package for ${brandObj?.name || ''} ${categoryObj?.name || 'appliance'}.`,
    };
    handleSelectProduct(genericProduct);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Model / Variant"
        subtitle={`${brandObj?.name || ''} ${categoryObj?.name || ''}`.trim() || 'Appliance'}
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Choose your specific appliance model for accurate parts & rate cards:
        </Text>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              selected={draft.product?.id === item.id}
              onPress={() => handleSelectProduct(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="No Specific Model Listed"
              description={`We service all ${brandObj?.name || ''} ${categoryObj?.name || 'appliances'}. You can proceed with standard servicing.`}
              actionTitle={`Continue with Standard ${brandObj?.name || ''}`}
              onActionPress={handleGenericSelect}
            />
          }
          contentContainerStyle={styles.listContent}
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
  container: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  instructions: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginVertical: Spacing.md,
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
