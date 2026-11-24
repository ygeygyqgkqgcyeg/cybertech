import { useAuth } from '@clerk/expo';
import { useCallback, useRef, useState } from 'react';

import { Message } from '@/components/chat/types';

export type ChatResult = { summary: string; nextStep: string };

const FIRST_MESSAGE: Message = {
  id: 'start',
  role: 'assistant',
  text: "Hi! I'm here to listen. What happened?",
};

// Talks to our server (/api/chat) with the Clerk session token.
export function useChat(onFinished: (result: ChatResult) => void) {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([FIRST_MESSAGE]);
  const [typing, setTyping] = useState(false);
  const [failed, setFailed] = useState(false);
  const count = useRef(0);

  const ask = useCallback(
    async (history: Message[]) => {
      setTyping(true);
      setFailed(false);
      try {
        const token = await getToken();
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
        });
        if (!res.ok) throw new Error('request failed');
        const data = await res.json();
        const id = `a${++count.current}`;
        setMessages((prev) => [...prev, { id, role: 'assistant', text: data.reply }]);
        if (data.result) onFinished(data.result);
      } catch {
        setFailed(true); // the screen shows a friendly message, never the error
      } finally {
        setTyping(false);
      }
    },
    [getToken, onFinished],
  );

  const send = useCallback(
    (text: string) => {
      const next = [...messages, { id: `u${++count.current}`, role: 'user' as const, text }];
      setMessages(next);
      ask(next);
    },
    [messages, ask],
  );

  const retry = useCallback(() => ask(messages), [messages, ask]);

  return { messages, typing, failed, send, retry };
}
