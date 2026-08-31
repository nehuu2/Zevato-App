import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { categories } from '../../data/categories';
import { serviceOptions } from '../../data/services';
import { bookingStore } from '../../store/bookingStore';

export default function RequestTabScreen() {
  const router = useRouter();
  const [selectedCatId, setSelectedCatId] = useState(categories[0].id);
  const [issue, setIssue] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'emergency'>('normal');

  const handleSubmit = () => {
    const cat = categories.find((c) => c.id === selectedCatId) || categories[0];
    const catServices = serviceOptions[cat.id] || serviceOptions['ac'] || [];
    const defaultService =
      catServices.find((s) => s.id.includes('repair') || s.id.includes('checkup') || s.id.includes('service')) ||
      catServices[0];

    bookingStore.setCategory(cat);
    if (defaultService) {
      bookingStore.setService(defaultService);
    }
    bookingStore.setNotes(issue);
    router.push('/services/schedule');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Book a Service" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>1. Select Appliance</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((c) => {
            const isSelected = c.id === selectedCatId;
            return (
              <Button
                key={c.id}
                title={c.name}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setSelectedCatId(c.id)}
                style={[
                  styles.catPill,
                  !isSelected && styles.catPillInactive,
                ]}
              />
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>2. Service Urgency</Text>
        <View style={styles.urgencyRow}>
          <Button
            title="Standard Visit (Scheduled)"
            variant={urgency === 'normal' ? 'primary' : 'outline'}
            size="md"
            onPress={() => setUrgency('normal')}
            style={styles.urgencyBtn}
          />
          <Button
            title="⚡ Express Emergency (<60m)"
            variant={urgency === 'emergency' ? 'danger' : 'outline'}
            size="md"
            onPress={() => setUrgency('emergency')}
            style={styles.urgencyBtn}
          />
        </View>

        <Text style={styles.sectionTitle}>3. Describe the Problem</Text>
        <Input
          placeholder="e.g. Water is leaking from AC indoor unit, not cooling properly..."
          multiline
          numberOfLines={4}
          value={issue}
          onChangeText={setIssue}
          containerStyle={styles.inputContainer}
        />

        <Button
          title="Proceed to Schedule Slot"
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  categoriesRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  catPill: {
    borderRadius: BorderRadius.full,
  },
  catPillInactive: {
    borderColor: Colors.borderDark,
    backgroundColor: Colors.surface,
  },
  urgencyRow: {
    flexDirection: 'column',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  urgencyBtn: {
    width: '100%',
  },
  inputContainer: {
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
});
