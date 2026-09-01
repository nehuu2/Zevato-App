import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TrackingMap from '../../components/tracking/TrackingMap';
import TechnicianCard from '../../components/tracking/TechnicianCard';
import BookingProgress from '../../components/tracking/BookingProgress';
import { bookingService } from '../../services/bookings';
import { bookingStore } from '../../store/bookingStore';
import { socketService } from '../../services/socket';
import { Booking, BookingStatus } from '../../types/booking';

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking | null>(() =>
    id ? bookingStore.getBookingById(id) || null : null
  );
  const [loading, setLoading] = useState<boolean>(!booking);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(() => {
    if (booking?.status === 'confirmed' || booking?.status === 'technician_assigned') {
      return 'on_the_way';
    }
    return booking?.status || 'on_the_way';
  });
  const [etaMinutes, setEtaMinutes] = useState<number>(booking?.estimatedArrivalMinutes || 8);
  const [technicianCoords, setTechnicianCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    booking?.technician?.currentLocation || { latitude: 28.4595, longitude: 77.0266 }
  );

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(id);
      setBooking(data);
      if (data.status === 'confirmed' || data.status === 'technician_assigned') {
        setCurrentStatus('on_the_way');
      } else {
        setCurrentStatus(data.status);
      }
      if (data.technician?.currentLocation) {
        setTechnicianCoords(data.technician.currentLocation);
      }
    } catch (err) {
      console.warn(`Failed to fetch tracking details for #${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Subscribe to real-time events for this specific booking
  useEffect(() => {
    const unsubLocation = socketService.on('technician.location_updated', (payload) => {
      if (payload?.bookingId === id && payload?.data?.location) {
        setTechnicianCoords({
          latitude: payload.data.location.latitude,
          longitude: payload.data.location.longitude,
        });
        if (payload.data.location.estimatedArrivalMinutes) {
          setEtaMinutes(payload.data.location.estimatedArrivalMinutes);
        }
      }
    });

    const unsubStatus = socketService.on('booking.status_changed', (payload) => {
      if (payload?.bookingId === id && payload?.data?.status) {
        setCurrentStatus(payload.data.status);
      }
    });

    const unsubStore = bookingStore.subscribeBookings(() => {
      const updated = bookingStore.getBookingById(id || '');
      if (updated) {
        setBooking(updated);
        setCurrentStatus(updated.status);
        if (updated.technician?.currentLocation) {
          setTechnicianCoords(updated.technician.currentLocation);
        }
      }
    });

    return () => {
      unsubLocation();
      unsubStatus();
      unsubStore();
    };
  }, [id]);

  const technician = booking?.technician || {
    id: 'tech-101',
    name: 'Rajesh Sharma',
    phone: '+91 98765 12345',
    rating: 4.9,
    completedJobs: 420,
    experienceYears: 6,
    specialization: 'Appliance Specialist',
  };

  const handleSimulateMoveTechnician = async () => {
    if (!id) return;
    const newLat = (technicianCoords?.latitude || 28.4595) + (Math.random() * 0.002 - 0.001);
    const newLng = (technicianCoords?.longitude || 77.0266) + (Math.random() * 0.002 - 0.001);
    const newEta = Math.max(2, etaMinutes - 2);

    setTechnicianCoords({ latitude: newLat, longitude: newLng });
    setEtaMinutes(newEta);

    try {
      await bookingService.updateTechnicianLocation(id, newLat, newLng, newEta);
    } catch (e) {
      console.warn('Update location error:', e);
    }
  };

  const handleSimulateArrived = async () => {
    setCurrentStatus('in_progress');
    if (id) {
      try {
        await bookingService.updateBookingStatus(id, 'in_progress', 'Technician arrived on site.');
      } catch (e) {
        console.warn('Status update warning:', e);
      }
    }
    Alert.alert('Technician Arrived', `${technician.name} has arrived at your address and begun diagnostic inspection.`);
  };

  const handleSimulateCompleted = async () => {
    if (id) {
      try {
        await bookingService.updateBookingStatus(id, 'completed', 'Service successfully completed.');
      } catch (e) {
        console.warn('Status update warning:', e);
      }
    }
    router.replace({
      pathname: '/bookings/completed',
      params: { id: id || '' },
    });
  };

  if (loading && !booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header title="Live Service Tracking" showBack onBackPress={() => router.back()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Connecting to live tracking...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const customerAddress = booking?.address?.street
    ? [booking.address.street, booking.address.city].filter(Boolean).join(', ')
    : 'Customer Location';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Live Service Tracking"
        subtitle={id ? `Booking #${id}` : undefined}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-time Map with GPS Coordinates */}
        <TrackingMap
          technicianName={technician.name}
          customerAddress={customerAddress}
          technicianCoordinates={technicianCoords}
          estimatedTime={currentStatus === 'in_progress' ? 'Service in progress' : `${etaMinutes} mins away`}
        />

        {/* Technician Card with Call/Chat */}
        <TechnicianCard
          technician={technician}
          onCallPress={() => {
            Alert.alert('Calling Technician', `Connecting call to ${technician.name} at ${technician.phone}...`);
          }}
          onChatPress={() => {
            Alert.alert('In-App Chat', `Connecting live chat with ${technician.name}...`);
          }}
        />

        {/* Status Timeline */}
        <BookingProgress status={currentStatus} />

        {/* Development-Only Simulation Controls */}
        {__DEV__ && (
          <View style={styles.simulationCard}>
            <Text style={styles.simTitle}>⚡ Developer Real-Time Simulator</Text>
            <Text style={styles.simSubtitle}>
              Simulate live technician movement and lifecycle changes (broadcasts real-time WebSocket events):
            </Text>

            <View style={styles.simButtonsCol}>
              {currentStatus === 'on_the_way' && (
                <>
                  <Button
                    title="📍 Simulate: Update GPS Position (-2 mins)"
                    variant="outline"
                    onPress={handleSimulateMoveTechnician}
                    style={styles.simBtn}
                  />
                  <Button
                    title="🏁 Simulate: Technician Arrived"
                    variant="primary"
                    onPress={handleSimulateArrived}
                    style={styles.simBtn}
                  />
                </>
              )}

              {currentStatus === 'in_progress' && (
                <Button
                  title="✅ Simulate: Complete Service"
                  variant="primary"
                  onPress={handleSimulateCompleted}
                  style={styles.simBtn}
                />
              )}

              {currentStatus !== 'in_progress' && currentStatus !== 'on_the_way' && (
                <Button
                  title="View Completed Report"
                  variant="outline"
                  onPress={handleSimulateCompleted}
                  style={styles.simBtn}
                />
              )}
            </View>
          </View>
        )}

        <Button
          title="Back to Booking Details"
          variant="ghost"
          onPress={() => router.back()}
          style={styles.backBtn}
        />
        <View style={{ height: 32 }} />
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  simulationCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: Spacing.md,
    ...Elevation.sm,
  },
  simTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  simSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  simButtonsCol: {
    gap: Spacing.xs + 2,
  },
  simBtn: {
    width: '100%',
  },
  backBtn: {
    marginTop: Spacing.md,
    width: '100%',
  },
});
