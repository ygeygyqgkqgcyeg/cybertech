import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { ScreenLayout } from '@/components/screen-layout';
import { colors, fontSizes } from '@/theme';

// Lets the browser window close when Google sends the learner back to the app.
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const [error, setError] = useState('');

  // Android: preload the browser so the Google page opens faster.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => void WebBrowser.coolDownAsync();
  }, []);

  const signIn = async () => {
    setError('');
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        // Clerk needs an explicit app-scheme redirect on phones (scheme is in app.json).
        redirectUrl: AuthSession.makeRedirectUri({ scheme: 'cybertech', path: 'sso-callback' }),
      });
      // The (auth) layout then redirects signed-in users to home.
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (e) {
      if (__DEV__) console.warn('Google sign-in failed:', e); // dev only
      setError("We couldn't sign you in. Please try again.");
    }
  };

  return (
    <ScreenLayout title="Welcome" body="Sign in to get started. It only takes a moment.">
      <Button label="Sign in with Google" onPress={signIn} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.text, fontSize: fontSizes.md },
});
