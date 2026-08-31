import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSSO } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Colors from '../../constants/colors';
import { BorderRadius, Elevation, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { authStore } from '../../store/authStore';

// Ensure any completed web auth sessions are handled
WebBrowser.maybeCompleteAuthSession();

export interface GoogleSignInButtonProps {
  buttonText?: string;
  style?: StyleProp<ViewStyle>;
  onSuccess?: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  buttonText = 'Continue with Google',
  style,
  onSuccess,
}) => {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Warm up the browser on mobile for faster OAuth redirect
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handlePress = async () => {
    try {
      setLoading(true);
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'zevatoapp',
      });

      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        await authStore.setOnboardingCompleted(true);
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('/(tabs)/home');
        }
      } else if (signUp?.status === 'missing_requirements') {
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      if (err?.code !== 'SIGN_IN_CANCELLED' && err?.code !== '-5') {
        console.warn('Google Sign-In error:', err);
        const errorMsg =
          err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          err?.message ||
          'Google authentication could not be completed. Please check your network and try again.';
        Alert.alert('Sign In', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={loading}
      onPress={handlePress}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <View style={styles.contentRow}>
          <View style={styles.googleIconBox}>
            <Ionicons name="logo-google" size={19} color="#EA4335" />
          </View>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.sm,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconBox: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.1,
  },
});

export default GoogleSignInButton;
