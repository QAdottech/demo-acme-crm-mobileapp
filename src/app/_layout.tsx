import '../../global.css';
import { SessionProvider, useSession } from '@/context/AuthContext';
import { PipelineProvider } from '@/context/PipelineContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'sign-in',
};

function RootLayoutNav() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;
    void SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) {
    return <View className="flex-1 bg-brand-900" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
          animation: 'fade',
        }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <PipelineProvider>
        <RootLayoutNav />
      </PipelineProvider>
    </SessionProvider>
  );
}
