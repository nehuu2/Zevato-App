import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import RequestCard from '../../components/requests/RequestCard';
import EmptyState from '../../components/common/EmptyState';
import { mockRequests } from '../../data/requests';

export default function RequestsIndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="All Requests" showBack onBackPress={() => router.back()} />
      <View style={styles.container}>
        <FlatList
          data={mockRequests}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onPress={() => router.push(`/requests/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No Requests"
              description="You have no service requests filed yet."
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
    paddingTop: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
