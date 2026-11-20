import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

import { useUserSync } from '@/hooks/use-user-sync';

// Signed-out users are sent to sign-in.
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
