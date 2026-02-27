import { useTheme } from '@/context/ThemeContext';
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
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-xl border px-4`}
        style={{
          backgroundColor: colors.inputBg,
          borderColor: error ? colors.danger : colors.inputBorder,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? colors.danger : colors.iconSecondary}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className="flex-1 text-base py-4"
          style={{ color: colors.inputText }}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.iconSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-xs mt-1 ml-1" style={{ color: colors.errorText }}>
          {error}
        </Text>
      )}
    </View>
  );
}
