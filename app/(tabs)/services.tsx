import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
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
    router.push('/services/brands');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="All Appliance Services" />
      <View style={styles.container}>
        <Input
          placeholder="Search AC, Washing Machine, Geyser..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          containerStyle={styles.searchBox}
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
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
