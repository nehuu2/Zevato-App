import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { authStore } from '../store/authStore';
import Typography from '../constants/typography';
import { BorderRadius, Spacing } from '../constants/spacing';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check onboarding status and transition
    const checkStateAndNavigate = async () => {
      // Add minimum splash display time for branding experience
      const [isOnboardingCompleted] = await Promise.all([
        authStore.loadInitialState(),
        new Promise((resolve) => setTimeout(resolve, 1600)),
      ]);

      if (isOnboardingCompleted) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    };

    checkStateAndNavigate();
  }, [fadeAnim, scaleAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.white} />
          </View>
        </View>

        <Text style={styles.brandTitle}>
          ZEVOTA<Text style={styles.brandAccent}> CARE</Text>
        </Text>
        <Text style={styles.brandTagline}>
          Smart Appliance Care & Trusted Repairs
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing experience...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  brandAccent: {
    color: Colors.primary,
  },
  brandTagline: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
