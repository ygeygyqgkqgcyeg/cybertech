import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

// Signed-out users are sent to sign-in.
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
