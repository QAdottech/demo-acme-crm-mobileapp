import React from 'react';
import { Text, View } from 'react-native';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-2xl',
};

export function Avatar({
  initials,
  size = 'md',
  color = '#6366F1',
}: AvatarProps) {
  return (
    <View
      className={`${sizeClasses[size]} rounded-full items-center justify-center`}
      style={{ backgroundColor: `${color}30` }}
    >
      <Text
        className={`${textSizes[size]} font-bold`}
        style={{ color }}
      >
        {initials}
      </Text>
    </View>
  );
}
