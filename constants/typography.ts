import { TextStyle } from 'react-native';
import Colors from './colors';

export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  lineHeight: {
    xs: 14,
    sm: 18,
    base: 22,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    xxxl: 38,
    display: 44,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },
  presets: {
    display: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: Colors.text,
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: Colors.textSecondary,
    },
    caption: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: Colors.textMuted,
    },
    button: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: Colors.white,
    },
  },
};

export default Typography;
