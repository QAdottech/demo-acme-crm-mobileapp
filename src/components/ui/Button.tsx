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
  const isDisabled = disabled || loading;

  const baseClass = 'rounded-xl py-4 px-6 items-center justify-center flex-row';
  const variantClass = {
    primary: 'bg-brand-500',
    secondary: 'bg-slate-700 border border-slate-600',
    danger: 'bg-red-500/10 border border-red-500/30',
    ghost: 'bg-transparent',
  }[variant];

  const textClass = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-slate-200 font-semibold text-base',
    danger: 'text-red-400 font-semibold text-base',
    ghost: 'text-brand-400 font-semibold text-base',
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseClass} ${variantClass} ${isDisabled ? 'opacity-50' : 'active:opacity-80'}`}
      style={style}
    >
      {loading && (
        <ActivityIndicator
          color={variant === 'danger' ? '#F87171' : '#FFFFFF'}
          size="small"
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={textClass}>{title}</Text>
    </Pressable>
  );
}
