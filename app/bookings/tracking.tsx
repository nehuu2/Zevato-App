import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TrackingMap from '../../components/tracking/TrackingMap';
import TechnicianCard from '../../components/tracking/TechnicianCard';
import BookingProgress from '../../components/tracking/BookingProgress';
import { mockBookings } from '../../data/bookings';

export default function TrackingScreen() {
  const router = useRouter();
  const activeBooking = mockBookings[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Live Technician Tracking" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Real-time Map Simulation */}
        <TrackingMap
          technicianName={activeBooking.technician?.name || 'Rajesh Sharma'}
          estimatedTime="8 mins"
        />

        {/* Technician Card with Call/Chat */}
        {activeBooking.technician && (
          <TechnicianCard
            technician={activeBooking.technician}
            onCallPress={() => {}}
            onChatPress={() => {}}
          />
        )}

        {/* Status Timeline */}
        <BookingProgress status="on_the_way" />

        <Button
          title="Simulate Service Completion"
          variant="outline"
          onPress={() => router.push('/bookings/completed')}
          style={styles.completeBtn}
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
  completeBtn: {
    marginTop: Spacing.lg,
  },
});
