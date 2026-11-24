// Simple in-memory limiter: max requests per user per window.
// Note: resets on restart and is per server instance. Use a shared store (e.g. Redis) if you scale out.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

export function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(userId, recent);
    return true;
  }
  recent.push(now);
  hits.set(userId, recent);
  return false;
}
