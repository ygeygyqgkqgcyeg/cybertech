import { useAuth } from '@clerk/expo';
import { useEffect, useRef } from 'react';

// Tells our server about the signed-in user, once per app session.
// The server reads the user from the Clerk token, never from anything we send.
export function useUserSync() {
  const { isSignedIn, getToken } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (!isSignedIn || done.current) return;
    done.current = true;

    (async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/users/sync', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) done.current = false;
      } catch {
        done.current = false; // try again next time the layout mounts
      }
    })();
  }, [isSignedIn, getToken]);
}
