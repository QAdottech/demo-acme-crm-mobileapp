import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'sm' }: LogoProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center">
      {/* Signal bars icon */}
      <View className="flex-row items-end mr-2" style={{ gap: 2 }}>
        {[12, 16, 22, 18, 14].map((h, i) => (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: size === 'lg' ? 5 : 3,
              height: size === 'lg' ? h : h * 0.6,
              backgroundColor: colors.logoBar,
              opacity: 0.5 + i * 0.12,
            }}
          />
        ))}
      </View>
      <View>
        <Text
          className="font-bold"
          style={{
            fontSize: size === 'lg' ? 22 : 14,
            letterSpacing: size === 'lg' ? 3 : 2,
            color: colors.logoText,
          }}
        >
          ACME Signal
        </Text>
        {size === 'lg' && (
          <Text
            className="text-xs"
            style={{
              letterSpacing: 1.5,
              color: colors.logoSubtext,
            }}
          >
            CRM System Demo
          </Text>
        )}
      </View>
    </View>
  );
}
