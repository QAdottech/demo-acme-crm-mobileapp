import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function Card({ children, onPress, style, className = '' }: CardProps) {
  const baseClass = `bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${baseClass} active:opacity-90 active:scale-[0.98]`}
        style={style}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClass} style={style}>
      {children}
    </View>
  );
}
