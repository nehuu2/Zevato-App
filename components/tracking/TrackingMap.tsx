import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export interface TrackingMapProps {
  estimatedTime?: string;
  technicianName?: string;
  customerAddress?: string;
  technicianCoordinates?: {
    latitude: number;
    longitude: number;
  };
  style?: ViewStyle;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  estimatedTime = '8 mins away',
  technicianName = 'Rajesh Sharma',
  customerAddress = 'Service Location',
  technicianCoordinates,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Live Map Background Visual */}
      <View style={styles.mapGrid}>
        {/* Horizontal Road Blocks */}
        <View style={styles.gridLineHorizontal} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical} />
        <View style={styles.gridLineVertical2} />

        {/* Live GPS Route Path */}
        <View style={styles.routePath} />

        {/* Technician Pin */}
        <View style={styles.technicianPin}>
          <View style={styles.pinBubble}>
            <Ionicons name="bicycle" size={16} color={Colors.white} />
          </View>
          <View style={styles.pinArrow} />
          <View style={styles.pinLabel}>
            <Text style={styles.pinLabelText} numberOfLines={1}>{technicianName}</Text>
          </View>
        </View>

        {/* Customer Location Pin */}
        <View style={styles.homePin}>
          <View style={styles.homeBubble}>
            <Ionicons name="home" size={16} color={Colors.white} />
          </View>
          <View style={styles.homeLabel}>
            <Text style={styles.homeLabelText} numberOfLines={1}>Your Location</Text>
          </View>
        </View>

        {/* Live Tracking GPS Pill */}
        <View style={styles.liveGpsPill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveGpsText}>
            {technicianCoordinates
              ? `Live GPS: ${technicianCoordinates.latitude.toFixed(4)}, ${technicianCoordinates.longitude.toFixed(4)}`
              : 'Live Tracking Active'}
          </Text>
        </View>
      </View>

      {/* Floating Info Overlay */}
      <View style={styles.etaCard}>
        <View style={styles.etaIconContainer}>
          <Ionicons name="navigate" size={18} color={Colors.primary} />
        </View>
        <View style={styles.etaTextContainer}>
          <Text style={styles.etaTitle}>{technicianName} is en route</Text>
          <Text style={styles.etaSubtitle}>
            ETA: {estimatedTime} • {customerAddress}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
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
    top: 50,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#DDE6F2',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#DDE6F2',
  },
  gridLineVertical: {
    position: 'absolute',
    left: 80,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: '#DDE6F2',
  },
  gridLineVertical2: {
    position: 'absolute',
    right: 80,
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: '#DDE6F2',
  },
  routePath: {
    position: 'absolute',
    top: 65,
    left: 86,
    width: 160,
    height: 65,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  technicianPin: {
    position: 'absolute',
    top: 50,
    left: 68,
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
  pinLabel: {
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    marginTop: 2,
    ...Elevation.sm,
  },
  pinLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.text,
  },
  homePin: {
    position: 'absolute',
    top: 110,
    right: 68,
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
  homeLabel: {
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    marginTop: 2,
    ...Elevation.sm,
  },
  homeLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
  },
  liveGpsPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    ...Elevation.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#10B981',
  },
  liveGpsText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
  },
  etaCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
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
