import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface TrackingMapProps {
  estimatedTime?: string;
  technicianName?: string;
  style?: ViewStyle;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  estimatedTime = '12 mins away',
  technicianName = 'Technician',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Mock Map Background Visual */}
      <View style={styles.mapGrid}>
        <View style={styles.gridLineHorizontal} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical} />
        <View style={styles.gridLineVertical2} />

        {/* Route Line Mock */}
        <View style={styles.routePath} />

        {/* Technician Pin */}
        <View style={styles.technicianPin}>
          <View style={styles.pinBubble}>
            <Ionicons name="bicycle" size={16} color={Colors.white} />
          </View>
          <View style={styles.pinArrow} />
        </View>

        {/* Customer Location Pin */}
        <View style={styles.homePin}>
          <View style={styles.homeBubble}>
            <Ionicons name="home" size={16} color={Colors.white} />
          </View>
        </View>
      </View>

      {/* Floating Info Overlay */}
      <View style={styles.etaCard}>
        <View style={styles.etaIconContainer}>
          <Ionicons name="navigate" size={18} color={Colors.primary} />
        </View>
        <View style={styles.etaTextContainer}>
          <Text style={styles.etaTitle}>{technicianName} is en route</Text>
          <Text style={styles.etaSubtitle}>Estimated arrival in {estimatedTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    backgroundColor: '#E5EBF5',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapGrid: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#EAF0F8',
  },
  gridLineHorizontal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#DDE6F2',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#DDE6F2',
  },
  gridLineVertical: {
    position: 'absolute',
    left: 80,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#DDE6F2',
  },
  gridLineVertical2: {
    position: 'absolute',
    right: 90,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: '#DDE6F2',
  },
  routePath: {
    position: 'absolute',
    top: 80,
    left: 90,
    width: 150,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  technicianPin: {
    position: 'absolute',
    top: 65,
    left: 70,
    alignItems: 'center',
  },
  pinBubble: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.sm,
  },
  pinArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
  },
  homePin: {
    position: 'absolute',
    top: 115,
    right: 75,
    alignItems: 'center',
  },
  homeBubble: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.md,
  },
  etaCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Elevation.md,
  },
  etaIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaTextContainer: {
    flex: 1,
  },
  etaTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  etaSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});

export default TrackingMap;
