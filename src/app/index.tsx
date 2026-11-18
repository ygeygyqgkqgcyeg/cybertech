import { Redirect } from 'expo-router';

// The (app) layout sends signed-out users on to sign-in.
export default function Index() {
  return <Redirect href="/home" />;
}
