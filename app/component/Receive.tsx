'use client';

import { useState } from 'react';

type Message = { 
    id: number; 
    country: string | null; 
    handle: string | null;
    lines: string[] };

type Status = 'idle' | 'loading' | 'done' | 'empty' | 'error';

export default function Receive() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  async function receive() {
    setStatus('loading');
    try {
      const res = await fetch('/api/receive', { method: 'POST' });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      const data = await res.json();
      if (!data.messages || data.messages.length === 0) {
        setStatus('empty');
        return;
      }
      setMessages(data.messages);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="mt-8 space-y-6">
        {messages.map((m) => (
          <blockquote key={m.id} className="rounded border-l-2 border-gray-300 py-2 pl-4">
            {m.lines.map((line, i) => (
              <p key={i} className="leading-relaxed">
                {line}
              </p>
            ))}

            {(m.handle || m.country) && (
            <footer className="mt-2 text-xs text-gray-500">
                {[m.handle, m.country].filter(Boolean).join(' · ')}
            </footer>
            )}
          </blockquote>
        ))}
        <p className="text-sm text-gray-500">
          These were written for you. They won&apos;t be shown again.
        </p>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <p className="mt-8">
        No messages are waiting right now. Please check back later.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <button
        onClick={receive}
        disabled={status === 'loading'}
        className="rounded bg-black px-5 py-3 text-white disabled:opacity-40"
      >
        {status === 'loading' ? 'Opening…' : 'Receive a message'}
      </button>
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600">Something went wrong. Try again.</p>
      )}
    </div>
  );
}