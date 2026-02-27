import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  icon,
  error,
  isPassword = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-300 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-slate-800 rounded-xl border px-4 ${
          error ? 'border-red-500' : 'border-slate-600'
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? '#EF4444' : '#94A3B8'}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className="flex-1 text-white text-base py-4"
          placeholderTextColor="#64748B"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-400 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
