import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import RequestTabs, { RequestTabType, TabItem } from '../../components/requests/RequestTabs';
import RequestCard from '../../components/requests/RequestCard';
import { mockRequests } from '../../data/requests';

export default function RequestsTabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RequestTabType>('all');

  const tabItems: TabItem[] = [
    { id: 'all', label: 'All', count: mockRequests.length },
    {
      id: 'active',
      label: 'Active',
      count: mockRequests.filter((r) => r.status === 'assigned' || r.status === 'in_progress' || r.status === 'pending').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: mockRequests.filter((r) => r.status === 'resolved' || r.status === 'closed').length,
    },
  ];

  const filtered = mockRequests.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return r.status === 'assigned' || r.status === 'in_progress' || r.status === 'pending';
    if (activeTab === 'completed') return r.status === 'resolved' || r.status === 'closed';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Service Requests" />
      <View style={styles.container}>
        <RequestTabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <FlatList
          data={filtered}
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
              icon="document-text-outline"
              title="No Requests Found"
              description="You have no service requests in this tab."
              actionTitle="Book New Service"
              onActionPress={() => router.push('/(tabs)/services')}
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
  listContent: {
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xs,
  },
});
