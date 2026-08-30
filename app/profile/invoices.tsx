import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import { formatCurrency } from '../../utils/formatCurrency';

const sampleInvoices = [
  { id: 'INV-2026-89021', service: 'Power Jet AC Deep Cleaning', date: '30 Aug 2026', amount: 499, status: 'Paid' },
  { id: 'INV-2026-88412', service: 'Drum Descaling Washing Machine', date: '28 Aug 2026', amount: 399, status: 'Paid' },
  { id: 'INV-2026-87103', service: 'Water Purifier Filter Replacement', date: '15 Jul 2026', amount: 850, status: 'Paid' },
];

export default function InvoicesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Invoices & Bills" showBack onBackPress={() => router.back()} />
      <View style={styles.container}>
        <FlatList
          data={sampleInvoices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/bookings/invoice')}
              style={styles.card}
            >
              <View style={styles.left}>
                <View style={styles.iconCircle}>
                  <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.invNumber}>{item.id}</Text>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>

              <View style={styles.right}>
                <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidText}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
