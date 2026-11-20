import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

// Returns the verified Clerk user ID, or null if the token is missing/invalid.
export async function getVerifiedClerkId(request: Request): Promise<string | null> {
  try {
    const state = await clerk.authenticateRequest(request, { acceptsToken: 'session_token' });
    if (!state.isAuthenticated) return null;
    return state.toAuth().userId;
  } catch {
    return null;
  }
}
