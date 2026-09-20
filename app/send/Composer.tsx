'use client';

import { useState } from 'react';
import type { Slot, SlotId } from '@/lib/clauses';
import type { Handle } from '@/lib/handles';


type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Composer({ slots, handle }: { slots: Slot[]; handle: Handle }) {
  const ordered = [...slots].sort((a, b) => a.order - b.order);
  
  const [picked, setPicked] = useState<Partial<Record<SlotId, string>>>({});
  const [status, setStatus] = useState<Status>('idle');


  const complete = ordered.every((s) => picked[s.id]);

  const preview = ordered
    .map((s) => s.clauses.find((c) => c.id === picked[s.id])?.en)
    .filter(Boolean)
    .join(' ');

  function choose(slotId: SlotId, clauseId: string) {
    setPicked((prev) => ({ ...prev, [slotId]: clauseId }));
    setStatus('idle');
  }

  async function submit() {
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(picked),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-8">
        <p className="text-lg">Sent. Someone will read it.</p>
        <button
          onClick={() => {
            setPicked({});
            setStatus('idle');
          }}
          className="mt-4 underline"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6"> 
      {ordered.map((slot) => ( //looks through the slots and creates a dropdown for each slot
        <div key={slot.id}>
          <label htmlFor={slot.id} className="block text-sm font-medium">
            {slot.label}
          </label>
          <select
            id={slot.id}
            value={picked[slot.id] ?? ''}
            onChange={(e) => choose(slot.id, e.target.value)}
            className="mt-1 w-full rounded border p-2"
          >
            <option value="">Choose one…</option>
            {slot.clauses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
      ))}



      <div className="rounded bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Preview</p>
        <p className="mt-2 min-h-[3rem]">
          {preview || <span className="text-gray-400">Your message appears here.</span>}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          — {handle.adjective} {handle.noun}
        </p>
      </div>

      <button
        onClick={submit}
        disabled={!complete || status === 'sending'}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-40"
      >
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Try again.</p>
      )}
    </div>

    
  );
}