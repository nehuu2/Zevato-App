import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export type RequestTabType = 'all' | 'active' | 'completed' | 'cancelled';

export interface TabItem {
  id: RequestTabType;
  label: string;
  count?: number;
}

export interface RequestTabsProps {
  tabs: TabItem[];
  activeTab: RequestTabType;
  onTabChange: (tab: RequestTabType) => void;
  style?: ViewStyle;
}

export const RequestTabs: React.FC<RequestTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => onTabChange(tab.id)}
            style={[
              styles.tabButton,
              isActive && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View
                style={[
                  styles.countBadge,
                  isActive && styles.countBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isActive && styles.countTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 4,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  countBadgeActive: {
    backgroundColor: Colors.primaryLight,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: Colors.primaryDark,
  },
});

export default RequestTabs;
