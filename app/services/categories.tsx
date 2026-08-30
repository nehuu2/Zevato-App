import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import CategoryCard from '../../components/services/CategoryCard';
import { categories } from '../../data/categories';
import { Category } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function CategoriesScreen() {
  const router = useRouter();

  const handleSelect = (category: Category) => {
    bookingStore.setCategory(category);
    router.push('/services/brands');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Choose Category" showBack onBackPress={() => router.back()} />
      <View style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => handleSelect(item)}
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
    paddingTop: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
