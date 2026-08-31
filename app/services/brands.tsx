import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import BrandCard from '../../components/services/BrandCard';
import { brands } from '../../data/brands';
import { categories } from '../../data/categories';
import { Brand } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function BrandsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const draft = bookingStore.getState();
  
  const categoryId = params.categoryId || draft.category?.id || 'ac';
  const categoryObj = categories.find((c) => c.id === categoryId) || draft.category;

  const filteredBrands = brands.filter(
    (b) => !categoryId || b.categories.includes(categoryId)
  );

  const handleSelectBrand = (brand: Brand) => {
    bookingStore.setBrand(brand);
    router.push({
      pathname: '/services/products',
      params: { categoryId, brandId: brand.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Brand"
        subtitle={categoryObj?.name || 'Appliance'}
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Select your appliance manufacturer to view compatible services:
        </Text>

        <FlatList
          data={filteredBrands}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BrandCard
              brand={item}
              selected={draft.brand?.id === item.id}
              onPress={() => handleSelectBrand(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="hardware-chip-outline"
              title="No Brands Found"
              description={`We couldn't find specific brand listings for ${categoryObj?.name || 'this category'}.`}
              actionTitle="Choose Another Category"
              onActionPress={() => router.back()}
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
