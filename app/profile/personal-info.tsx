import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { userStore } from '../../store/userStore';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const user = userStore.getState();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    userStore.updateProfile({ name, email, phone });
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully.');
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Personal Information" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />

        <Input
          label="Mobile Phone"
          value={phone}
          onChangeText={setPhone}
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail-outline"
          keyboardType="email-address"
        />

        <Button
          title="Save Changes"
          loading={loading}
          onPress={handleSave}
          style={styles.saveBtn}
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
  saveBtn: {
    marginTop: Spacing.md,
  },
});
