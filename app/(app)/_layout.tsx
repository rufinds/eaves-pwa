import { Redirect, Stack } from 'expo-router';
import { HeaderBackButton } from '@/components/HeaderBackButton';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthStore } from '@/state/useAuthStore';
import { colors } from '@/theme/tokens';

export default function AppLayout() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isInitialized) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="details/[id]" options={{ title: 'Event', headerLeft: () => <HeaderBackButton /> }} />
    </Stack>
  );
}