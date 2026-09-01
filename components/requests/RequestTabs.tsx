import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
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
    <View style={[styles.wrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const displayCount = tab.count !== undefined ? tab.count : 0;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onTabChange(tab.id)}
              style={[
                styles.tabButton,
                isActive ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {tab.label} ({displayCount})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonInactive: {
    backgroundColor: '#F0F3FA',
  },
  tabText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  tabTextInactive: {
    color: '#4B5563',
  },
});

export default RequestTabs;
