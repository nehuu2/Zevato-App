import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'lg',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: styles.smContainer,
          text: styles.smText,
        };
      case 'md':
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
      case 'lg':
      default:
        return {
          container: styles.lgContainer,
          text: styles.lgText,
        };
    }
  };

  const sizeStyle = getSizeStyle();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        sizeStyle.container,
        isDisabled && styles.disabledContainer,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              sizeStyle.text,
              leftIcon ? { marginLeft: Spacing.sm } : undefined,
              rightIcon ? { marginRight: Spacing.sm } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Variants
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryContainer: {
    backgroundColor: Colors.primaryLight,
  },
  secondaryText: {
    color: Colors.primaryDark,
  },
  outlineContainer: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostContainer: {
    backgroundColor: Colors.transparent,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerContainer: {
    backgroundColor: Colors.danger,
  },
  dangerText: {
    color: Colors.white,
  },
  // Sizes
  smContainer: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  smText: {
    fontSize: Typography.fontSize.sm,
  },
  mdContainer: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
  },
  mdText: {
    fontSize: Typography.fontSize.base,
  },
  lgContainer: {
    paddingVertical: Spacing.base - 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  lgText: {
    fontSize: Typography.fontSize.md,
  },
  disabledContainer: {
    opacity: 0.55,
  },
});

export default Button;
