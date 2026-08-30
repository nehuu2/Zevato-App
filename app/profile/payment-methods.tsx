import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { userStore } from '../../store/userStore';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const paymentMethods = userStore.getState().paymentMethods;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Payment Methods" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Saved Payment Options</Text>

        {paymentMethods.map((pm) => (
          <View key={pm.id} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons
                name={
                  pm.type === 'upi'
                    ? 'qr-code-outline'
                    : pm.type === 'card'
                    ? 'card-outline'
                    : 'cash-outline'
                }
                size={22}
                color={Colors.primary}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{pm.title}</Text>
              {pm.subtitle && <Text style={styles.subtitle}>{pm.subtitle}</Text>}
            </View>
            {pm.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        ))}

        <Button
          title="+ Add New Payment Method"
          variant="outline"
          style={styles.addBtn}
        />
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
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBtn: {
    marginTop: Spacing.md,
  },
});
