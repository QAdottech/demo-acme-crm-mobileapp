import '../../global.css';
import { SessionProvider, useSession } from '@/context/AuthContext';
import { PipelineProvider } from '@/context/PipelineContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const { isDark } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(app)';

    if (!session && inAuthGroup) {
      router.replace('/sign-in');
    } else if (session && !inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return <View className="flex-1 bg-slate-50 dark:bg-brand-900" />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <PipelineProvider>
          <RootLayoutNav />
        </PipelineProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
