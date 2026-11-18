Add Clerk authentication using the current Clerk Expo documentation. Check the
docs for the installed Expo SDK version first.

- Google sign-in through Clerk
- Use only EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in the app
- Use Expo Router route groups: (auth) for sign-in, (app) for home/chat/result
- Signed-out users are redirected to sign-in; signed-in users skip it
- Add a sign-out button on home
- .env file has the key

No secret keys in the app.