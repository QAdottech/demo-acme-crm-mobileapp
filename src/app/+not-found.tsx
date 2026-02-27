import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-slate-50 dark:bg-brand-900 items-center justify-center p-4">
        <Text className="text-slate-900 dark:text-white text-xl font-bold mb-4">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-brand-500 dark:text-brand-400 text-base">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
