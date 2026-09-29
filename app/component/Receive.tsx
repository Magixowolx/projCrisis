'use client';

import { useState } from 'react';

type Message = {
  id: number;
  country: string | null;
  handle: string | null;
  lines: string[];
  signatureEmoji: string | null;
};

type Status = 'idle' | 'loading' | 'done' | 'empty' | 'error';

export default function Receive() {
  const [repeat, setRepeat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  // [6] which of the three you're currently reading
  const [index, setIndex] = useState(0);

  async function receive() {
    setStatus('loading');
    try {
      const res = await fetch('/api/receive', { method: 'POST' });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      const data = await res.json();

      setRepeat(Boolean(data.repeat));

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
      <div className="w-full max-w-[30rem] text-left">

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
              className="rise mb-4 text-message"
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

        <div className="mt-12 text-center">
          {last ? (
            /* [5] was text-gray-500 */
            <p className="text-[0.95rem] text-star-dim">
              {repeat
                ? 'These are still yours. New ones will be here later.'
                : 'These were written for you. They won\u2019t be shown again.'}
            </p>
          ) : (
            /* [6] advance instead of showing everything at once */
            <button onClick={() => setIndex(index + 1)} className="btn">
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="w-full max-w-[30rem]">
        <p className="rise text-message">No one has left a message tonight.</p>
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
    <div className="w-full max-w-[30rem]">
      <p className="text-message mx-auto block">Someone wrote something for you.</p>

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
