# AGENTS.md

## Project overview

This is an Expo/React Native mobile application for learners. Prioritize
mobile-first patterns, performance, accessibility, and cross-platform
compatibility.

The app is a minimal, animated AI chat that guides a learner through a short
self-check to help them understand whether an experience may be bullying. The
assistant asks simple, supportive questions one at a time, such as:

- Was it repeated?
- Did it hurt or make you feel unsafe?
- Was it public or witnessed by others?

The result should explain the situation clearly and suggest an appropriate next
step, such as talking to a trusted adult, teacher, parent, or school counselor.
Avoid presenting the check as a formal diagnosis or definitive legal judgment.

## Product scope (keep it minimal)

Build only what is listed here. Do not add screens, features, or dependencies
that are not requested in the current prompt.

Screens (Expo Router, in `src/app/`):

1. `sign-in` - Clerk sign-up with email + password and an emailed verification code.
2. `home` - short welcome and a "Start" button.
3. `chat` - the hero screen. The AI-guided self-check.
4. `result` - plain-language summary and a suggested next step.

Build order follows the feature prompts given by the mentor. Complete one
feature, run lint and type checks, and stop. Do not build ahead.

## Design and styling

- The chat is the centerpiece: warm, friendly, well-decorated, and animated.
- Define all design tokens once in `src/theme/` (colors, spacing, radius, font
  sizes, shadows). Use a maximum of 3 base colors plus 1 accent.
- Never hardcode colors, spacing, or font sizes inside components. Import from
  the theme.
- Use `react-native-reanimated` for animation (install with
  `npx expo install`). Required chat animations: message bubbles fade and slide
  in, a typing indicator while the assistant responds, smooth auto-scroll.
- Keep animations short (under about 300ms) and respect the OS "reduce motion"
  setting.
- The input bar must be keyboard-safe on both iOS and Android.
- Use simple, supportive, age-appropriate language in all UI text.
- Accessibility: every touchable has an `accessibilityLabel`, text has
  sufficient contrast, and touch targets are at least 44x44.
- Keep components small and single-purpose. Chat components live in
  `src/components/chat/`. Never place reusable components inside `src/app/`.

## AI chat feature

- The chat uses the Claude API.
- Never place the Claude API key in the Expo/React Native client bundle,
  `app.json`, source code, or any value prefixed with `EXPO_PUBLIC_`.
- Claude requests must go through a secure server-side API or backend route.
- Store the Claude credential in a server-side environment variable, for
  example `ANTHROPIC_API_KEY`.
- The chat route must verify the Clerk session token before doing anything and
  return 401 if it is missing or invalid.
- The system prompt must: use simple, supportive language, ask the self-check
  questions one at a time, end with a suggested next step, and never claim to
  diagnose or give a legal judgment.
- Do not log API keys, learner answers, or sensitive personal information.
- Send only the minimum information needed to generate the guidance.
- Add rate limiting to the chat route.
- Add clear fallback behavior when the AI service is unavailable: show a
  friendly message and a retry button. The app must remain usable without
  exposing a secret or displaying raw provider errors.

## Safety rules (non-negotiable)

This app is used by young learners and touches a sensitive topic.

- If a learner mentions self-harm, suicide, abuse, or immediate danger, stop the
  quiz flow. Respond with warmth, encourage them to talk to a trusted adult
  right now, and show help resources (for Kenya: Childline Kenya, 116, free -
  verify the number before release).
- Enforce this in two places: in the server system prompt AND with a
  client-side keyword check, so it still works if the AI service fails.
- Never minimize, judge, or blame the learner.
- Never present results as a diagnosis, a legal ruling, or a guarantee.

## Database (Neon Postgres)

- Use Neon Postgres with Prisma, accessed only from the server-side API. The
  Expo client never connects to the database directly.
- `DATABASE_URL` lives only in server environment variables. Never in the
  client bundle, `app.json`, source code, or any `EXPO_PUBLIC_` value.
- Keep the schema minimal: `User` (Clerk user ID, createdAt) and `ChatSession`
  (user, startedAt). Do not store message content or quiz answers.
- Treat quiz responses as sensitive learner information. Do not store them
  unless the product explicitly requires it and the mentor approves.
- Create or update the user record only from a verified Clerk token, never from
  client-supplied IDs.
- Use Prisma migrations. Never edit the database by hand.

## Authentication

- Authentication will use Clerk.
- Sign-up uses email + password with an email verification code (enable
  "Email verification code" in the Clerk dashboard). No social/Google login.
- Keep authentication state and protected routes handled through the app's
  existing Expo Router structure (route groups, redirect signed-out users to
  `sign-in`).
- Never hardcode Clerk secret keys in the mobile app.
- Public Clerk configuration may use `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, while
  secret keys must remain server-side.
- Do not bypass authentication checks for protected data or backend requests.

## Expo has changed - do not trust training data

Expo ships breaking changes every SDK release. APIs may be renamed, moved, or
removed. Before writing code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Consult the matching versioned documentation at
   `https://docs.expo.dev/versions/v<major>.0.0/`.
3. For anything else, consult `https://docs.expo.dev/llms.txt` and follow its
   links to the relevant documentation.

Do the same for Clerk, Prisma, and Neon: read the current official docs before
writing integration code.

## Navigation and routing

- Use Expo Router for all navigation.
- Routes live in `src/app/`; every file there is a screen and `_layout.tsx`
  files define navigators.
- Keep reusable components, hooks, and utilities outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Router documentation: `https://docs.expo.dev/router/introduction.md`.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`,
`eas submit`) and to ship over-the-air updates (`eas update`). Use `bunx eas-cli
<command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise.
Documentation: `https://docs.expo.dev/eas/index.md`.

## Native project rules

- If `ios/` and `android/` directories do not exist, they are generated through
  Continuous Native Generation. Never create or edit them by hand; configure
  native behavior through `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with
  native code, use a development build.
- Prefer recommended Expo modules over third-party libraries and check available
  skills before adding dependencies.

## Secrets and environment

- Client-safe values only use the `EXPO_PUBLIC_` prefix (for example the Clerk
  publishable key).
- Server-only values: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `CLERK_SECRET_KEY`.
- `.env` files are gitignored. Provide a `.env.example` with names only, never
  real values.
- Never commit secrets. If one is committed by mistake, rotate it immediately.

## Working rules

- One feature per prompt. Do only what the current prompt asks.
- Do not add dependencies without saying why.
- Keep files small and code short and readable. Learners must be able to
  understand what was written.
- Explain briefly what you changed and why when you finish.
- Run `npx expo lint` and `npx tsc --noEmit` before declaring a task complete,
  and fix every error.

## Commands

Use `bunx` instead of `npx` if the project contains `bun.lock`.

```bash
npx expo install <package>
npx expo start
npx expo lint
npx tsc --noEmit
npx expo-doctor
npx expo install --fix
```

Use `npx expo install <package>` instead of npm, yarn, pnpm, or bun add so Expo
can resolve an SDK-compatible version.