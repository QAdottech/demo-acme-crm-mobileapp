import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-brand-900 items-center justify-center p-4">
        <Text className="text-white text-xl font-bold mb-4">
          This screen does not exist.
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-brand-400 text-base">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
