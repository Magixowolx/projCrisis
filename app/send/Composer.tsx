'use client';

import { useState } from 'react';
import type { Slot, SlotId } from '@/lib/clauses';
import type { Handle } from '@/lib/handles';
import type { Identity } from '@/lib/visitor';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'tooSoon';

export default function Composer({ slots, identity }: { slots: Slot[]; identity: Identity }) {
  const ordered = [...slots].sort((a, b) => a.order - b.order);
  
  const [picked, setPicked] = useState<Partial<Record<SlotId, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const complete = ordered.every((s) => picked[s.id]);
  const firstUnanswered = ordered.findIndex((slot) => !picked[slot.id]);
  const visibleCount = firstUnanswered === -1 ? ordered.length : firstUnanswered + 1;

  const preview = ordered
    .map((s) => s.clauses.find((c) => c.id === picked[s.id])?.en)
    .filter(Boolean)
    .join('\n');

  function choose(slotId: SlotId, clauseId: string) {
    setPicked((prev) => {
      const next = { ...prev, [slotId]: clauseId };
      if (!clauseId) {
        const slotIndex = ordered.findIndex((slot) => slot.id === slotId);
        for (const slot of ordered.slice(slotIndex + 1)) delete next[slot.id];
      }
      return next;
    });
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
      if (res.status === 429) { setStatus('tooSoon'); return; }
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
      {ordered.slice(0, visibleCount).map((slot) => (
        <div key={slot.id} className="rise">
          <label htmlFor={slot.id} className="block text-[clamp(0.8rem,calc(0.75rem+0.2vw),0.95rem)] font-medium text-star-dim">
            {slot.label}
          </label>
          <select
            id={slot.id}
            value={picked[slot.id] ?? ''}
            onChange={(e) => choose(slot.id, e.target.value)}
            className="mt-1 w-full rounded border border-star-faint bg-night p-2 text-base text-star"
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



      <div className="rounded border border-star-faint bg-night p-4 text-star">
        <p className="text-xs uppercase tracking-wide text-star-dim">Preview</p>
        <div className="mt-2 min-h-[3rem] whitespace-pre-line font-message">
          {ordered.map((slot) => {
            const clause = slot.clauses.find((candidate) => candidate.id === picked[slot.id]);
            if (!clause) return null;
            return (
              <span key={`${slot.id}-${clause.id}`} className="rise block">
                {clause.en}
              </span>
            );
          })}
          {!preview && <span className="text-star-dim">Your message appears here.</span>}
        </div>
        <p className="mt-6 text-right text-[0.975rem] italic text-star-dim">
        {identity.signature} {identity.adjective} {identity.noun}
        </p>
      </div>

      {complete && (
        <button
          onClick={submit}
          disabled={status === 'sending'}
          className="rounded bg-send-button px-4 py-2 text-night transition-colors hover:bg-star disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Try again.</p>
      )}
    </div>

    
  );
}
