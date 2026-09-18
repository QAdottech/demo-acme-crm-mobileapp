import '../../global.css';
import { SessionProvider, useSession } from '@/context/AuthContext';
import { PipelineProvider } from '@/context/PipelineContext';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

// Android can ignore hideAsync() if it runs before the first native layout.
// Always force-hide so a delayed session read cannot pin the splash forever.
const splashFallback = setTimeout(() => {
  void SplashScreen.hideAsync();
}, 2000);

function hideSplash() {
  clearTimeout(splashFallback);
  void SplashScreen.hideAsync();
}

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);

  const dismissSplash = useCallback(() => {
    if (splashHidden.current) return;
    splashHidden.current = true;
    hideSplash();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(app)';

    if (!session && inAuthGroup) {
      router.replace('/sign-in');
    } else if (session && !inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [session, isLoading, segments, router]);

  useEffect(() => {
    if (!isLoading) dismissSplash();
  }, [isLoading, dismissSplash]);

  if (isLoading) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root} onLayout={dismissSplash}>
      <StatusBar style="light" />
      <Slot />
    </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
