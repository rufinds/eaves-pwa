import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StyledButton } from '@/components/StyledButton';
import { InputField, Screen, Stack } from '@/components/primitives';
import { useAuthStore } from '@/state/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isInitialized, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    setError('');
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed. Check your credentials.');
    }
  };

  if (!isInitialized) return <LoadingScreen />;
  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <Screen padding="lg">
      <Stack flex={1} justify="center" gap="lg">
        <BrandHeader title="Welcome back" subtitle="Log in to see what happens in Leuven" />
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          testID="email-input"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="password-input"
          error={error !== '' ? error : undefined}
          onSubmitEditing={() => void handleLogin()}
        />
        <StyledButton
          label="Log in"
          onPress={() => void handleLogin()}
          isLoading={isLoading}
          testID="login-button"
        />
      </Stack>
    </Screen>
  );
}
