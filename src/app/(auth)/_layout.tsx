import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

// Signed-in users skip the sign-in screen.
export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
