import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { bookingService } from '../../services/bookings';
import { bookingStore } from '../../store/bookingStore';
import { Booking } from '../../types/booking';

export default function InvoicesScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(() =>
    bookingStore.getConfirmedBookings().filter((b) => b.paymentStatus === 'paid' || b.status === 'completed')
  );
  const [loading, setLoading] = useState<boolean>(bookings.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchInvoices = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (bookings.length === 0) setLoading(true);

    try {
      const list = await bookingService.getAllBookings();
      const paid = list.filter((b) => b.paymentStatus === 'paid' || b.status === 'completed');
      setBookings(paid);
    } catch (e) {
      console.warn('Failed to load invoices from server:', e);
      // Fallback to store
      setBookings(
        bookingStore.getConfirmedBookings().filter((b) => b.paymentStatus === 'paid' || b.status === 'completed')
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [bookings.length]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Invoices & Bills" showBack onBackPress={() => router.back()} />
      <View style={styles.container}>
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your invoices...</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchInvoices(true)}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/bookings/invoice',
                    params: { id: item.id },
                  })
                }
                style={styles.card}
              >
                <View style={styles.left}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.invNumber}>
                      INV-{item.id.replace('BK-', '').replace('ZEV-', '')}
                    </Text>
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>

                <View style={styles.right}>
                  <Text style={styles.amount}>{formatCurrency(item.totalAmount)}</Text>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>Paid</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <EmptyState
                icon="receipt-outline"
                title="No Invoices Yet"
                description="Your GST tax invoices and receipts will appear here after booking services."
                actionTitle="Browse Services"
                onActionPress={() => router.push('/(tabs)/services')}
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invNumber: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  serviceName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.text,
  },
  paidBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginTop: 4,
  },
  paidText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
