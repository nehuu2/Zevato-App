import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AppConfig from '../../constants/config';

export default function ContactSupportScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${AppConfig.supportPhone}`).catch((err) => {
      console.warn('Call intent error:', err);
      Alert.alert('Customer Care', `Reach us at ${AppConfig.supportPhone}`);
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${AppConfig.supportEmail}?subject=Support Request - Zevota Care`).catch((err) => {
      console.warn('Email intent error:', err);
      Alert.alert('Email Support', `Write to us at ${AppConfig.supportEmail}`);
    });
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Incomplete', 'Please fill in both subject and message before submitting.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Message Sent', 'Your ticket has been logged. Our support specialist will reach out within 15 minutes.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Contact Support" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Quick Contact Interactive Tiles */}
        <View style={styles.quickContactsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCall}
            style={styles.contactTile}
          >
            <Ionicons name="call" size={24} color={Colors.primary} />
            <Text style={styles.tileTitle}>Call Us</Text>
            <Text style={styles.tileSub}>{AppConfig.supportPhone}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEmail}
            style={styles.contactTile}
          >
            <Ionicons name="mail" size={24} color={Colors.primary} />
            <Text style={styles.tileTitle}>Email Us</Text>
            <Text style={styles.tileSub}>{AppConfig.supportEmail}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.formTitle}>Submit a Support Ticket</Text>

        <Input
          label="Subject / Booking ID"
          placeholder="e.g. Inquiry regarding booking BK-89021"
          value={subject}
          onChangeText={setSubject}
        />

        <Input
          label="Message / Query Details"
          placeholder="Describe your question or issue in detail..."
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          inputStyle={styles.textArea}
        />

        <Button
          title="Submit Support Request"
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitBtn}
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
  },
  quickContactsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  contactTile: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  tileTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  tileSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  formTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
