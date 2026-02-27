import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  primary: '#6366F1',
  primaryText: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBorder: '#E2E8F0',
  tabActive: '#6366F1',
  tabInactive: '#94A3B8',
  headerTint: '#0F172A',
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  inputBg: '#F1F5F9',
  inputBorder: '#CBD5E1',
  inputText: '#0F172A',
  placeholder: '#94A3B8',
  icon: '#64748B',
  iconSecondary: '#94A3B8',
  switchTrack: '#6366F1',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.08)',
  dangerBorder: 'rgba(239,68,68,0.15)',
  loadingSpinner: '#FFFFFF',
  loadingSpinnerDanger: '#F87171',
  progressBg: '#E2E8F0',
  timelineLine: '#E2E8F0',
  timelineIconBg: '#F1F5F9',
  timelineIconBorder: '#E2E8F0',
  activityIcon: '#64748B',
  logoBar: '#6366F1',
  logoText: '#334155',
  logoSubtext: '#94A3B8',
  errorBg: 'rgba(239,68,68,0.06)',
  errorBorder: 'rgba(239,68,68,0.12)',
  errorText: '#DC2626',
  sectionLabel: '#64748B',
  settingsIconBg: '#F1F5F9',
};

const darkColors: typeof lightColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  borderLight: '#1E293B',
  primary: '#6366F1',
  primaryText: '#FFFFFF',
  tabBar: '#0F172A',
  tabBorder: '#1E293B',
  tabActive: '#6366F1',
  tabInactive: '#64748B',
  headerTint: '#F8FAFC',
  cardBg: '#1E293B',
  cardBorder: 'rgba(51,65,85,0.5)',
  inputBg: '#1E293B',
  inputBorder: '#475569',
  inputText: '#F8FAFC',
  placeholder: '#64748B',
  icon: '#94A3B8',
  iconSecondary: '#94A3B8',
  switchTrack: '#6366F1',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.1)',
  dangerBorder: 'rgba(239,68,68,0.3)',
  loadingSpinner: '#FFFFFF',
  loadingSpinnerDanger: '#F87171',
  progressBg: '#334155',
  timelineLine: '#334155',
  timelineIconBg: '#1E293B',
  timelineIconBorder: '#334155',
  activityIcon: '#94A3B8',
  logoBar: '#6366F1',
  logoText: '#CBD5E1',
  logoSubtext: '#64748B',
  errorBg: 'rgba(239,68,68,0.1)',
  errorBorder: 'rgba(239,68,68,0.2)',
  errorText: '#F87171',
  sectionLabel: '#94A3B8',
  settingsIconBg: 'rgba(51,65,85,0.5)',
};

const THEME_STORAGE_KEY = 'acme-crm-theme-mode';

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  isDark: false,
  setThemeMode: () => {},
  toggleTheme: () => {},
  colors: lightColors,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useNativeColorScheme();
  const { setColorScheme } = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeState(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const isDark =
    themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  // Sync with NativeWind
  useEffect(() => {
    if (!isLoaded) return;
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark, isLoaded, setColorScheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ themeMode, isDark, setThemeMode, toggleTheme, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
