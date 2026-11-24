import { SYSTEM_PROMPT } from '@/server/chat-prompt';
import { getVerifiedClerkId } from '@/server/auth';
import { isRateLimited } from '@/server/rate-limit';

const MODEL = 'claude-sonnet-5-5';
const MAX_MESSAGES = 20; // send only what is needed
const MAX_TEXT_LENGTH = 1000;

const FRIENDLY_ERROR = 'Sorry, something went wrong. Please try again.';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Keeps only valid messages, the most recent ones, starting with a user message.
function cleanMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages: ChatMessage[] = [];
  for (const m of input) {
    const role = m?.role;
    const text = m?.text;
    if ((role !== 'user' && role !== 'assistant') || typeof text !== 'string') return null;
    if (!text.trim()) continue;
    messages.push({ role, content: text.slice(0, MAX_TEXT_LENGTH) });
  }
  const recent = messages.slice(-MAX_MESSAGES);
  while (recent.length > 0 && recent[0].role !== 'user') recent.shift();
  return recent.length > 0 ? recent : null;
}

// The final message looks like "[DONE]\nSUMMARY: ...\nNEXT STEP: ...".
// For that message we also return the parts, so the app can show the result screen.
function parseReply(reply: string) {
  const match = reply.match(/^\s*\[DONE\]\s*SUMMARY:\s*([\s\S]*?)\s*NEXT STEP:\s*([\s\S]*?)\s*$/);
  if (!match) return { reply: reply.replace('[DONE]', '').trim(), result: null };
  const [, summary, nextStep] = match;
  return { reply: summary, result: { summary, nextStep } };
}

export async function POST(request: Request) {
  // 1. Verify the Clerk session token first.
  const clerkId = await getVerifiedClerkId(request);
  if (!clerkId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Rate limit per user.
  if (isRateLimited(clerkId)) {
    return Response.json({ error: 'Please wait a moment and try again.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const messages = cleanMessages(body?.messages);
    if (!messages) return Response.json({ error: FRIENDLY_ERROR }, { status: 400 });

    // 3. Call Claude. The key stays on the server.
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!response.ok) throw new Error('provider error'); // never forwarded

    const data = await response.json();
    const reply = data?.content?.find((b: { type: string }) => b.type === 'text')?.text;
    if (typeof reply !== 'string' || !reply) throw new Error('empty reply');

    return Response.json(parseReply(reply));
  } catch {
    // No logging: messages and keys must never end up in logs.
    return Response.json({ error: FRIENDLY_ERROR }, { status: 500 });
  }
}
