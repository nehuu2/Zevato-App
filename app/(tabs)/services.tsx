import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import SectionHeader from '../../components/common/SectionHeader';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import CategoryCard from '../../components/services/CategoryCard';
import { categories } from '../../data/categories';
import { Category } from '../../types/service';
import { bookingStore } from '../../store/bookingStore';

export default function ServicesTabScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCategory = (category: Category) => {
    bookingStore.setCategory(category);
    router.push({
      pathname: '/services/categories',
      params: { categoryId: category.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Appliance Services" />
      <View style={styles.container}>
        <Input
          placeholder="Search AC, Refrigerator, Chimney..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchBox}
        />

        <SectionHeader
          title="All Service Categories"
          subtitle="Select an appliance type to begin diagnosis & repair"
        />

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => handleSelectCategory(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No categories found"
              description={`No appliance services matched "${searchQuery}". Please check your search term.`}
              actionTitle="Clear Search"
              onActionPress={() => setSearchQuery('')}
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
  searchBox: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
