import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
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
import { bookingStore } from '../../store/bookingStore';
import { mockBookings } from '../../data/bookings';
import { Booking, BookingStatus } from '../../types/booking';

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [booking, setBooking] = useState<Booking>(() => {
    return bookingStore.getBookingById(id || '') || mockBookings[0];
  });

  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(() => {
    if (booking.status === 'confirmed' || booking.status === 'technician_assigned') {
      return 'on_the_way';
    }
    return booking.status;
  });

  const technician = booking.technician || {
    id: 'tech-101',
    name: 'Rajesh Sharma',
    phone: '+91 98765 12345',
    rating: 4.9,
    completedJobs: 420,
    experienceYears: 6,
    specialization: 'Appliance Specialist',
  };

  const handleSimulateArrived = () => {
    setCurrentStatus('in_progress');
    bookingStore.updateBookingStatus(booking.id, 'in_progress');
    Alert.alert('Technician Arrived', `${technician.name} has arrived at your address and started service inspection.`);
  };

  const handleSimulateCompleted = () => {
    bookingStore.updateBookingStatus(booking.id, 'completed');
    router.replace({
      pathname: '/bookings/completed',
      params: { id: booking.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Live Service Tracking"
        subtitle={`Booking #${booking.id}`}
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-time Map Simulation */}
        <TrackingMap
          technicianName={technician.name}
          customerAddress={
            booking.address?.street
              ? [booking.address.street, booking.address.city].filter(Boolean).join(', ')
              : 'Customer Location'
          }
          estimatedTime={currentStatus === 'in_progress' ? 'Service in progress' : '8 mins away'}
        />

        {/* Technician Card with Call/Chat */}
        <TechnicianCard
          technician={technician}
          onCallPress={() => {
            Alert.alert('Calling Technician', `Calling ${technician.name} at ${technician.phone}...`);
          }}
          onChatPress={() => {
            Alert.alert('In-App Chat', `Connecting live chat with ${technician.name}...`);
          }}
        />

        {/* Status Timeline */}
        <BookingProgress status={currentStatus} />

        {/* Mock Status Simulation Controls */}
        <View style={styles.simulationCard}>
          <Text style={styles.simTitle}>⚡ Testing & Progress Simulator</Text>
          <Text style={styles.simSubtitle}>
            Simulate technician arrival and service completion steps:
          </Text>

          {currentStatus === 'on_the_way' && (
            <Button
              title="Simulate: Technician Arrived"
              variant="primary"
              onPress={handleSimulateArrived}
              style={styles.simBtn}
            />
          )}

          {currentStatus === 'in_progress' && (
            <Button
              title="Simulate: Complete Service"
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
  simulationCard: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
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
  simBtn: {
    width: '100%',
  },
  backBtn: {
    marginTop: Spacing.md,
    width: '100%',
  },
});
