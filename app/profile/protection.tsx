import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function ProtectionScreen() {
  const router = useRouter();
  const { hasProtectionPlan, updateProfile } = useUserProfile();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewing, setRenewing] = useState(false);

  const handleSimulateRenew = async () => {
    setRenewing(true);
    try {
      await updateProfile({ hasProtectionPlan: true });
      setTimeout(() => {
        setRenewing(false);
        setShowRenewModal(false);
        Alert.alert(
          'Membership Renewed! 🎉',
          'Your Zevota Care Plus annual protection plan has been successfully activated through 31 December 2026.'
        );
      }, 600);
    } catch (e) {
      setRenewing(false);
      Alert.alert('Renewal Notice', 'Your protection plan is active.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Zevota Care Plus" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pro Banner */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={14} color="#FFF" />
            <Text style={styles.badgeText}>MEMBERSHIP ACTIVE</Text>
          </View>
          <Text style={styles.planTitle}>Annual Protection Plan</Text>
          <Text style={styles.planSub}>Valid through 31 December 2026</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLbl}>Free Visits Left</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>₹0</Text>
              <Text style={styles.statLbl}>Inspection Fee</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>10%</Text>
              <Text style={styles.statLbl}>Off Spare Parts</Text>
            </View>
          </View>
        </View>

        {/* Benefits List */}
        <Text style={styles.sectionHeader}>Your Plan Benefits</Text>

        <View style={styles.benefitCard}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>Unlimited Free Diagnostic Visits</Text>
            <Text style={styles.benefitDesc}>Zero call-out fees on any home appliance repair.</Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="speedometer-outline" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>Priority 60-Minute Dispatch</Text>
            <Text style={styles.benefitDesc}>Skip the queue with fast-tracked technician assignment.</Text>
          </View>
        </View>

        <View style={styles.benefitCard}>
          <Ionicons name="pricetag-outline" size={24} color={Colors.primary} />
          <View style={styles.benefitInfo}>
            <Text style={styles.benefitTitle}>10% Flat Discount on OEM Parts</Text>
            <Text style={styles.benefitDesc}>Genuine manufacturer spares at reduced rates.</Text>
          </View>
        </View>

        <Button
          title="Renew / Extend Membership"
          onPress={() => setShowRenewModal(true)}
          style={styles.renewBtn}
        />
      </ScrollView>

      {/* Renewal Confirmation Modal */}
      <Modal
        visible={showRenewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRenewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Extend Care Plus Protection</Text>
              <TouchableOpacity onPress={() => setShowRenewModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalBody}>
              Renewing your Care Plus membership extends 3 annual free diagnostic visits, zero inspection charges, and 10% spare part discounts for another 12 months.
            </Text>

            <View style={styles.modalPriceBox}>
              <Text style={styles.modalPriceLabel}>Annual Care Plan Fee</Text>
              <Text style={styles.modalPriceVal}>₹999 / Year</Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Confirm & Activate Plan"
                loading={renewing}
                onPress={handleSimulateRenew}
                style={{ flex: 1 }}
              />
              <Button
                title="Cancel"
                variant="outline"
                disabled={renewing}
                onPress={() => setShowRenewModal(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Elevation.md,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  planTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  planSub: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  statLbl: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  benefitDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  renewBtn: {
    marginTop: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  modalBody: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  modalPriceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  modalPriceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  modalPriceVal: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
