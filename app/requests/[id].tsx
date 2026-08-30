import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import RequestStatus from '../../components/requests/RequestStatus';
import { mockRequests } from '../../data/requests';
import { formatDate } from '../../utils/formatDate';

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const request = mockRequests.find((r) => r.id === id || r.ticketNumber === id) || mockRequests[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={request.ticketNumber}
        subtitle={request.appliance}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Card */}
        <RequestStatus status={request.status} />

        {/* Issue Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Issue Description</Text>
          <Text style={styles.descText}>{request.issueDescription}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaVal}>{request.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority</Text>
              <Text style={[styles.metaVal, { color: request.priority === 'high' ? Colors.danger : Colors.text }]}>
                {request.priority.toUpperCase()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaVal}>{formatDate(request.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Activity Updates Timeline */}
        {request.updates && request.updates.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Status Updates</Text>
            {request.updates.map((update, idx) => (
              <View key={update.id} style={styles.updateRow}>
                <View style={styles.dot} />
                <View style={styles.updateInfo}>
                  <View style={styles.updateHeader}>
                    <Text style={styles.updateTitle}>{update.title}</Text>
                    <Text style={styles.updateTime}>{update.timestamp}</Text>
                  </View>
                  <Text style={styles.updateDesc}>{update.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            title="Track Assigned Technician"
            leftIcon={<Ionicons name="location" size={18} color={Colors.white} />}
            onPress={() => router.push('/bookings/tracking')}
          />
          {request.status !== 'cancelled' && request.status !== 'resolved' && (
            <Button
              title="Cancel Request"
              variant="danger"
              onPress={() => router.push('/requests/cancel')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.xs + 2,
    ...Elevation.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  descText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  metaVal: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  updateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  updateInfo: {
    flex: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  updateTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  updateTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  updateDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  buttonGroup: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
