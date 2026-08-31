import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types/user';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

import { Image } from 'expo-image';

export interface ProfileHeaderProps {
  user: UserProfile;
  onEditPress?: () => void;
  style?: ViewStyle;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditPress,
  style,
}) => {
  const nameParts = (user.name || '').trim().split(' ').filter(Boolean);
  const initials =
    nameParts.length > 0
      ? nameParts
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : 'U';

  return (
    <View style={[styles.card, style]}>
      {user.avatarUrl ? (
        <Image
          source={{ uri: user.avatarUrl }}
          style={styles.avatarImage}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.avatarBox}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name || 'User'}</Text>
          {user.hasProtectionPlan && (
            <View style={styles.proBadge}>
              <Ionicons name="sparkles" size={10} color="#FFF" />
              <Text style={styles.proText}>PLUS</Text>
            </View>
          )}
        </View>
        {user.phone ? (
          <Text style={styles.phone}>{user.phone}</Text>
        ) : (
          <Text style={[styles.phone, styles.placeholderText]}>No phone added</Text>
        )}
        {user.email ? (
          <Text style={styles.email}>{user.email}</Text>
        ) : null}
      </View>

      {onEditPress ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onEditPress}
          style={styles.editBtn}
        >
          <Ionicons name="pencil" size={16} color={Colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
    marginVertical: Spacing.sm,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.base,
    backgroundColor: Colors.surface,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  avatarInitials: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    gap: 2,
  },
  proText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },
  phone: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  email: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileHeader;
