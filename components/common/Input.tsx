import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import Typography from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword,
  containerStyle,
  inputStyle,
  multiline,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          multiline && styles.multilineContainer,
          isFocused && styles.containerFocused,
          Boolean(error) && styles.containerError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? Colors.primary : Colors.textMuted}
            style={[styles.leftIcon, multiline && styles.multilineIcon]}
          />
        )}
        <TextInput
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
          >
            <Ionicons name={rightIcon} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs + 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    minHeight: 52,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm + 2,
    minHeight: 100,
  },
  containerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  containerError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    paddingVertical: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 0,
    minHeight: 80,
  },
  leftIcon: {
    marginRight: Spacing.sm + 2,
  },
  multilineIcon: {
    marginTop: 2,
  },
  rightIconButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.danger,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default Input;
