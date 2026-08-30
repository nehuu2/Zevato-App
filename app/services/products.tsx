import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import ProductCard from '../../components/services/ProductCard';
import { products } from '../../data/products';
import { Product } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ProductsScreen() {
  const router = useRouter();
  const draft = bookingStore.getState();

  const handleSelectProduct = (product: Product) => {
    bookingStore.setProduct(product);
    router.push('/services/service-details');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Model / Type"
        subtitle={`${draft.brand?.name || ''} ${draft.category?.name || ''}`}
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Choose your specific appliance variant:
        </Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              selected={draft.product?.id === item.id}
              onPress={() => handleSelectProduct(item)}
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
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
