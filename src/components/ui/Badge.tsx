import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <View
      className="rounded-full px-3 py-1 self-start"
      style={{ backgroundColor: `${color}20` }}
    >
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
