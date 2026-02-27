import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/layout/Logo';
import { getGreeting } from '@/lib/utils';

export function Header() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();

  return (
    <View
      className="bg-brand-900 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        <Logo size="sm" />
        {user && <Avatar initials={user.avatarInitials} size="sm" />}
      </View>
      {user && (
        <Text className="text-white text-xl font-bold mt-3">
          {getGreeting()}, {user.name.split(' ')[0]}
        </Text>
      )}
    </View>
  );
}
