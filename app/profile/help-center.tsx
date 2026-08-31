import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';

const faqs = [
  {
    q: 'How does the 30-day service warranty work?',
    a: 'Every repair and service performed by our certified experts includes a 30-day free revisit guarantee. If the same issue recurs within 30 days, we fix it at zero extra labor cost.',
  },
  {
    q: 'Are your spare parts genuine OEM?',
    a: 'Yes, 100%. We source certified manufacturer components directly with brand warranties.',
  },
  {
    q: 'How fast will the technician arrive for express bookings?',
    a: 'For express bookings, our nearest verified technician will reach your location within 60 minutes.',
  },
  {
    q: 'What payment modes are accepted?',
    a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Pay on Service Completion.',
  },
  {
    q: 'Can I cancel or reschedule my service booking?',
    a: 'Yes, you can cancel or reschedule any booking with no penalty up to 1 hour before the scheduled time slot.',
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Help Center" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          placeholder="Search questions or topics..."
          value={search}
          onChangeText={setSearch}
          leftIcon="search-outline"
        />

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {filteredFaqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setExpandedIndex(isExpanded ? null : index)}
              style={styles.faqCard}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.primary}
                />
              </View>
              {isExpanded && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </TouchableOpacity>
          );
        })}
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
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.text,
    marginVertical: Spacing.md,
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Elevation.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    paddingRight: Spacing.sm,
  },
  faqAnswer: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
});
