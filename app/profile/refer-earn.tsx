import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function ReferEarnScreen() {
  const router = useRouter();
  const { firstName, id } = useUserProfile();
  const referralCode = firstName
    ? `${firstName.toUpperCase().slice(0, 5)}${id ? id.slice(-3).toUpperCase() : '500'}`
    : 'ZEVOTA500';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my code ${referralCode} to get ₹500 off your first home appliance repair on Zevota Care! Download now.`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Refer & Earn" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBox}>
          <View style={styles.giftIconBox}>
            <Ionicons name="gift" size={48} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Invite Friends & Earn ₹500</Text>
          <Text style={styles.heroSub}>
            Share your referral link. When friends complete their first appliance repair, both of you earn ₹500 in care credits.
          </Text>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
        </View>

        {/* How It Works */}
        <Text style={styles.sectionHeader}>How It Works</Text>
        <View style={styles.stepRow}>
          <View style={styles.stepNum}><Text style={styles.numText}>1</Text></View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Share your invite code</Text>
            <Text style={styles.stepDesc}>Send your code via WhatsApp, SMS, or Social media.</Text>
          </View>
        </View>
        <View style={styles.stepRow}>
          <View style={styles.stepNum}><Text style={styles.numText}>2</Text></View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Friend books a service</Text>
            <Text style={styles.stepDesc}>They get instant ₹500 off on their first booking.</Text>
          </View>
        </View>
        <View style={styles.stepRow}>
          <View style={styles.stepNum}><Text style={styles.numText}>3</Text></View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>You get ₹500 Care credits</Text>
            <Text style={styles.stepDesc}>Credits automatically apply to your next repair bill.</Text>
          </View>
        </View>

        <Button
          title="Share Referral Link"
          leftIcon={<Ionicons name="share-social" size={18} color={Colors.white} />}
          onPress={handleShare}
          style={styles.shareBtn}
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
    paddingBottom: Spacing.xl,
  },
  heroBox: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginBottom: Spacing.lg,
  },
  giftIconBox: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: Spacing.md,
  },
  codeCard: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7DAFF',
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.8,
  },
  codeText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  stepDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  shareBtn: {
    marginTop: Spacing.sm,
  },
});
