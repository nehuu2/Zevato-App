import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  destructive?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  badgeColor = Colors.primary,
  destructive = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.iconCircle,
          destructive ? styles.iconCircleDestructive : styles.iconCircleRegular,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? Colors.danger : Colors.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      <Ionicons
        name="chevron-forward"
        size={18}
        color={destructive ? Colors.danger : Colors.textMuted}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  iconCircleRegular: {
    backgroundColor: Colors.primaryLight,
  },
  iconCircleDestructive: {
    backgroundColor: Colors.dangerLight,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
  },
  destructiveText: {
    color: Colors.danger,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  chevron: {
    marginLeft: Spacing.xs,
  },
});

export default ProfileMenuItem;
