import { useCallback, useEffect, useRef, useState } from 'react';

import { Message } from '@/components/chat/types';

const REPLY_DELAY_MS = 1500;

// Hardcoded replies, used only until the real AI is connected.
const FAKE_REPLIES = [
  'Thanks for telling me. Did this happen more than once?',
  'I hear you. Did it hurt or make you feel unsafe?',
  'That sounds hard. Did other people see it happen?',
];

export function useFakeChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', role: 'assistant', text: "Hi! I'm here to listen. What happened?" },
  ]);
  const [typing, setTyping] = useState(false);
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = useCallback((text: string) => {
    const n = ++count.current;
    setMessages((prev) => [...prev, { id: `u${n}`, role: 'user', text }]);
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const reply = FAKE_REPLIES[(n - 1) % FAKE_REPLIES.length];
      setMessages((prev) => [...prev, { id: `a${n}`, role: 'assistant', text: reply }]);
      setTyping(false);
    }, REPLY_DELAY_MS);
  }, []);

  return { messages, typing, send };
}
