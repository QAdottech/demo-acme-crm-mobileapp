import { useSession } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/layout/Logo';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn } = useSession();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    const success = await signIn(email, password);
    setLoading(false);

    if (!success) {
      setError('Invalid credentials. Try demo@acme.com / demo1234');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-brand-900"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View className="items-center mb-12">
          <Logo size="lg" />
          <Text className="text-slate-400 text-sm mt-3">
            Sales Pipeline Management
          </Text>
        </View>

        {/* Login Card */}
        <View className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
          <Text className="text-white text-2xl font-bold mb-1">
            Welcome back
          </Text>
          <Text className="text-slate-400 text-sm mb-6">
            Sign in to your account
          </Text>

          <Input
            label="Email"
            icon="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />

          <Input
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          {error ? (
            <View className="bg-red-500/10 rounded-xl p-3 mb-4 border border-red-500/20">
              <Text className="text-red-400 text-sm text-center">{error}</Text>
            </View>
          ) : null}

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
          />
        </View>

        {/* Demo hint */}
        <View className="items-center mt-6">
          <Text className="text-slate-500 text-xs">
            Demo credentials: demo@acme.com / demo1234
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
