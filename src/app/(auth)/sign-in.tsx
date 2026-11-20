import { useSignUp } from '@clerk/expo';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { ScreenLayout } from '@/components/screen-layout';
import { TextField } from '@/components/text-field';
import { colors, fontSizes } from '@/theme';

// Sign up in two steps: 1) email + password, 2) the code we email to the learner.
export default function SignInScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const busy = fetchStatus === 'fetching';
  // After step 1 the email is "unverified" until the right code is entered.
  const waitingForCode = signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address');

  const fail = (e: { longMessage?: string; message: string } | null) => {
    setError(e?.longMessage ?? e?.message ?? 'Something went wrong. Please try again.');
    return e !== null;
  };

  const createAccount = async () => {
    setError('');
    if (fail((await signUp.password({ emailAddress: email.trim(), password })).error)) return;
    fail((await signUp.verifications.sendEmailCode()).error);
  };

  const verifyCode = async () => {
    setError('');
    if (fail((await signUp.verifications.verifyEmailCode({ code: code.trim() })).error)) return;
    // The (auth) layout then redirects signed-in users to home.
    fail((await signUp.finalize()).error);
  };

  const resendCode = async () => {
    setError('');
    fail((await signUp.verifications.sendEmailCode()).error);
  };

  return waitingForCode ? (
    <ScreenLayout title="Check your email" body={`We sent a code to ${signUp.emailAddress}. Type it below.`}>
      <TextField
        label="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
      />
      <Button label="Verify" onPress={verifyCode} disabled={busy || code.trim().length === 0} />
      <Button label="Send a new code" onPress={resendCode} disabled={busy} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScreenLayout>
  ) : (
    <ScreenLayout title="Welcome" body="Create an account to get started. It only takes a moment.">
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <Button label="Sign up" onPress={createAccount} disabled={busy || !email.trim() || !password} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: colors.text, fontSize: fontSizes.md },
});
