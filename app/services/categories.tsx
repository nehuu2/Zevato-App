import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import CategoryCard from '../../components/services/CategoryCard';
import { categories } from '../../data/categories';
import { Category } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function CategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const currentCategoryId = params.categoryId || bookingStore.getState().category?.id;

  const handleSelect = (category: Category) => {
    bookingStore.setCategory(category);
    router.push({
      pathname: '/services/brands',
      params: { categoryId: category.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Select Category"
        subtitle="Choose your appliance type"
        showBack
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Select the appliance category requiring maintenance or repair service:
        </Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              selected={currentCategoryId === item.id}
              onPress={() => handleSelect(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="apps-outline"
              title="No Categories Found"
              description="No appliance categories are currently available. Please check back shortly."
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
