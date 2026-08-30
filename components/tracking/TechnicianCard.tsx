import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Technician } from '../../types/booking';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface TechnicianCardProps {
  technician: Technician;
  onCallPress?: () => void;
  onChatPress?: () => void;
  style?: ViewStyle;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onCallPress,
  onChatPress,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{technician.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#D97706" />
              <Text style={styles.ratingText}>{technician.rating}</Text>
            </View>
            <Text style={styles.jobsText}>• {technician.completedJobs}+ jobs done</Text>
          </View>
          <Text style={styles.expText}>
            {technician.experienceYears} Years Certified Experience
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCallPress}
          style={[styles.actionBtn, styles.callBtn]}
        >
          <Ionicons name="call" size={18} color={Colors.white} />
          <Text style={styles.callBtnText}>Call Technician</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onChatPress}
          style={[styles.actionBtn, styles.chatBtn]}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.primary} />
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginVertical: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  jobsText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  expText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  callBtn: {
    backgroundColor: Colors.primary,
  },
  callBtnText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.white,
  },
  chatBtn: {
    backgroundColor: Colors.primaryLight,
  },
  chatBtnText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default TechnicianCard;
