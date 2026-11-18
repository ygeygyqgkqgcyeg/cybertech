import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { ScreenLayout } from '@/components/screen-layout';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <ScreenLayout title="Welcome" body="Let's take a quick look at what happened, together.">
      <Button label="Start" onPress={() => router.push('/chat')} />
      {/* The (app) layout sends signed-out users back to sign-in. */}
      <Button label="Sign out" onPress={() => signOut()} />
    </ScreenLayout>
  );
}
