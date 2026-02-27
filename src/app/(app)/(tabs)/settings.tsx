import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useSession } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SettingsItem({
  icon,
  label,
  rightElement,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center py-3.5 border-b border-slate-700/30">
      <View className="w-9 h-9 rounded-xl bg-slate-700/50 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#94A3B8" />
      </View>
      <Text className="text-slate-200 text-base flex-1">{label}</Text>
      {rightElement ?? (
        <Ionicons name="chevron-forward" size={18} color="#64748B" />
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-brand-900"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 32,
      }}
    >
      {/* Profile Section */}
      <View className="items-center mb-8">
        <Avatar initials={user?.avatarInitials ?? '?'} size="lg" />
        <Text className="text-white text-xl font-bold mt-3">{user?.name}</Text>
        <Text className="text-slate-400 text-sm">{user?.email}</Text>
        <Text className="text-brand-400 text-xs mt-1">{user?.role}</Text>
      </View>

      {/* Settings Sections */}
      <Card className="mb-4">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Preferences
        </Text>
        <SettingsItem
          icon="notifications-outline"
          label="Notifications"
          rightElement={<Switch value={true} trackColor={{ true: '#6366F1' }} />}
        />
        <SettingsItem
          icon="moon-outline"
          label="Dark Mode"
          rightElement={<Switch value={true} trackColor={{ true: '#6366F1' }} disabled />}
        />
        <SettingsItem icon="language-outline" label="Language" />
      </Card>

      <Card className="mb-4">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Support
        </Text>
        <SettingsItem icon="help-circle-outline" label="Help Center" />
        <SettingsItem icon="chatbubble-outline" label="Contact Support" />
        <SettingsItem icon="document-text-outline" label="Privacy Policy" />
      </Card>

      <Card className="mb-6">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
          About
        </Text>
        <SettingsItem
          icon="information-circle-outline"
          label="Version"
          rightElement={
            <Text className="text-slate-500 text-sm">1.0.0</Text>
          }
        />
      </Card>

      {/* Logout Button */}
      <Button title="Sign Out" variant="danger" onPress={signOut} />
    </ScrollView>
  );
}
