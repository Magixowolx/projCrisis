'use client';

import { useEffect, useState } from 'react';

type Message = {
  id: number;
  country: string | null;
  handle: string | null;
  lines: string[];
  signatureEmoji: string | null;
};

type Status = 'idle' | 'loading' | 'done' | 'empty' | 'error';

export default function Receive({ onFinalMessageReady, onReadingChange, onRepeatChange }: { onFinalMessageReady: (ready: boolean) => void; onReadingChange: (reading: boolean) => void; onRepeatChange: (repeat: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  // [6] which of the three you're currently reading
  const [index, setIndex] = useState(0);
  useEffect(() => {
    onReadingChange(status === 'loading' || status === 'done');
  }, [status, onReadingChange]);

  useEffect(() => {
    if (status !== 'done' || messages.length === 0 || index !== messages.length - 1) {
      onFinalMessageReady(false);
      return;
    }

    const timeout = window.setTimeout(() => onFinalMessageReady(true), 4000);
    return () => window.clearTimeout(timeout);
  }, [status, index, messages.length, onFinalMessageReady]);

  async function receive() {
    setStatus('loading');
    try {
      const res = await fetch('/api/receive', { method: 'POST' });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      const data = await res.json();

      onRepeatChange(Boolean(data.repeat));

      if (!data.messages || data.messages.length === 0) {
        setStatus('empty');
        return;
      }

      setMessages(data.messages);
      setIndex(0); // [6] always start at the first one
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    // [6] one message, not all three
    const current = messages[index];
    const last = index === messages.length - 1;

    return (
      <div className="w-full max-w-[30rem] px-2 pt-10 text-left">

        {/* [7] three stars: which message you're on, and the metaphor */}
        <div className="mb-12 flex justify-center gap-6" aria-hidden="true">
          {messages.map((_, i) => (
            <span
              key={i}
              className={`h-[5px] w-[5px] rounded-full transition-all duration-500 ${
                i === index
                  ? 'bg-star shadow-[0_0_10px_2px_rgba(242,235,220,0.35)]'
                  : i < index
                    ? 'bg-star-dim'
                    : 'bg-star-faint'
              }`}
            />
          ))}
        </div>

        {/* [8] key={index} forces a remount so the animation replays */}
        <div key={index}>
          {current.lines.map((line, i) => (
            <p
              key={i}
              className="rise mb-4 text-xl font-message"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              {line}
            </p>
          ))}

          {(current.signatureEmoji || current.handle || current.country) && (
            <p
              className="rise mt-8 text-right text-[0.975rem] italic text-star-dim"
              style={{ animationDelay: '700ms' }}
            >
              {[current.signatureEmoji, current.handle, current.country]
                .filter(Boolean)
                .join(' ')}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          {index > 0 && (
            <button
              onClick={() => setIndex(index - 1)}
              aria-label="Previous message"
              className="px-3 py-1 text-3xl text-star-dim transition-colors hover:text-star"
            >
              ‹
            </button>
          )}
          {!last && (
            <button
              onClick={() => setIndex(index + 1)}
              aria-label="Next message"
              className="px-3 py-1 text-3xl text-star-dim transition-colors hover:text-star"
            >
              ›
            </button>
          )}
        </div>

      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="w-full max-w-[30rem] px-2 pt-10">
        <p className="rise font-message">No one has left a message tonight.</p>
        <p
          className="rise mt-5 text-[0.95rem] text-star-dim"
          style={{ animationDelay: '200ms' }}
        >
          More will be here later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[30rem] px-2 pt-10">
      <p className="font-message text-lg text-center">Someone wrote something for you.</p>

      {/* [5] was bg-black text-white */}
      <button
        onClick={receive}
        disabled={status === 'loading'}
        className="btn mt-8 mx-auto block"
      >
        {status === 'loading' ? 'Opening\u2026' : 'Open it'}
      </button>

      {/* [5] was text-red-600 — nothing here should look like an alarm */}
      {status === 'error' && (
        <p className="mt-4 text-[0.95rem] text-star-dim">
          That didn&apos;t work. Try again.
        </p>
      )}
    </div>
  );
}
