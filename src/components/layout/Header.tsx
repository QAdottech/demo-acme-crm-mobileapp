import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/layout/Logo';
import { getGreeting } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function Header() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const router = useRouter();

  return (
    <View
      className="bg-brand-900 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        <Logo size="sm" />
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.push('/search')}
            accessibilityLabel="Search deals"
            className="w-9 h-9 rounded-full bg-slate-800 items-center justify-center mr-2"
          >
            <Ionicons name="search" size={18} color="#94A3B8" />
          </Pressable>
          {user && <Avatar initials={user.avatarInitials} size="sm" />}
        </View>
      </View>
      {user && (
        <Text className="text-white text-xl font-bold mt-3">
          {getGreeting()}, {user.name.split(' ')[0]}
        </Text>
      )}
    </View>
  );
}
