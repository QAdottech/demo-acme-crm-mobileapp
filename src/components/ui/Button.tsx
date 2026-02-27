import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const baseClass = 'rounded-xl py-4 px-6 items-center justify-center flex-row';
  const variantClass = {
    primary: 'bg-brand-500',
    secondary: 'bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600',
    danger: 'border',
    ghost: 'bg-transparent',
  }[variant];

  const textClass = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-slate-800 dark:text-slate-200 font-semibold text-base',
    danger: 'font-semibold text-base',
    ghost: 'text-brand-500 dark:text-brand-400 font-semibold text-base',
  }[variant];

  const dangerStyle =
    variant === 'danger'
      ? { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }
      : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseClass} ${variantClass} ${isDisabled ? 'opacity-50' : 'active:opacity-80'}`}
      style={[dangerStyle, style]}
    >
      {loading && (
        <ActivityIndicator
          color={
            variant === 'danger'
              ? colors.loadingSpinnerDanger
              : colors.loadingSpinner
          }
          size="small"
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        className={textClass}
        style={variant === 'danger' ? { color: colors.errorText } : undefined}
      >
        {title}
      </Text>
    </Pressable>
  );
}
