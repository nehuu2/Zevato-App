import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import BrandCard from '../../components/services/BrandCard';
import { brands } from '../../data/brands';
import { Brand } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function BrandsScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();

  const handleSelectBrand = (brand: Brand) => {
    bookingStore.setBrand(brand);
    router.push('/services/products');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Brand"
        subtitle={draft.category?.name || 'Appliance'}
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Select your appliance manufacturer to view compatible services:
        </Text>

        <FlatList
          data={brands}
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
