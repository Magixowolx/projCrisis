// src/app/Identity.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { randomHandles, type Handle } from '@/lib/handles';
import { SIGNATURES, randomSignature } from '@/lib/signatures';
import type { Identity } from '@/lib/visitor';


function rollOne(): Handle {
  return randomHandles(1)[0];
}
function rollSignature(): string {
  return randomSignature();
}

function same(a: Handle, b: Handle) {
  return a.adjective === b.adjective && a.noun === b.noun;
}

export default function IdentityPanel({
  identity,
  compact = false,
}: {
  identity: Identity;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const [candidate, setCandidate] = useState<Identity>({
    adjective: identity.adjective,
    noun: identity.noun,
    signature: identity.signature,
  });
  const [saving, setSaving] = useState(false);

  async function save(patch: Record<string, string>) {
    setSaving(true);
    try {
      await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function reroll() {
    setCandidate((prev) => {
      let next = rollOne();
      for (let i = 0; i < 5 && same(next, prev); i++) next = rollOne();
      return { ...prev, adjective: next.adjective, noun: next.noun };
    });
  }
  function rerollSignature() {
    setCandidate((prev) => {
      let next = rollSignature();
      for (let i = 0; i < 5 && next === identity.signature; i++) next = rollSignature();
      return { ...prev, signature: next};
    });
  }

  const label = `${identity.signature} ${identity.adjective} ${identity.noun}`;

  if (!compact) {
    return (
      <div className="text-[0.95rem] text-star">
        <p>You sign as</p>
        <p className="mt-2 text-lg text-star">
          {candidate.signature} {candidate.adjective} {candidate.noun}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button onClick={reroll} disabled={saving} className="underline underline-offset-4">⟳ name</button>
          {!same(candidate, { adjective: identity.adjective, noun: identity.noun }) && (
            <button onClick={() => save({ adjective: candidate.adjective, noun: candidate.noun })} disabled={saving} className="underline underline-offset-4 text-star">Use this name</button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={rerollSignature} disabled={saving} className="underline underline-offset-4">Try another signature</button>
          {candidate.signature !== identity.signature && (
            <button onClick={() => save({ signature: candidate.signature })} disabled={saving} className="underline underline-offset-4 text-star">Use this signature</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col items-end">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Change your identity: ${label}`}
        className={`inline-flex items-center gap-2 border border-star-faint/50 bg-night/40 px-4 py-2 text-lg font-normal text-star transition hover:border-star-faint hover:bg-night/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-star ${open ? 'rounded-t-md rounded-b-none border-b-0' : 'rounded-md'}`}
      >
        <span>{label}</span>
        <span aria-hidden="true" className="text-star-dim">✎</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 w-max min-w-full rounded-b-md border border-star-faint bg-night p-4 text-[0.95rem] text-star shadow-lg">
          <p>You sign as</p>
          <p className="mt-2 text-lg text-star">
            {candidate.signature} {candidate.adjective} {candidate.noun}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={reroll} disabled={saving} className="underline underline-offset-4">🔄️ name</button>
            {!same(candidate, { adjective: identity.adjective, noun: identity.noun }) && (
              <button onClick={() => save({ adjective: candidate.adjective, noun: candidate.noun })} disabled={saving} className="underline underline-offset-4 text-star">Use this name</button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={rerollSignature} disabled={saving} className="underline underline-offset-4">🔄️ signature</button>
            {candidate.signature !== identity.signature && (
              <button onClick={() => save({ signature: candidate.signature })} disabled={saving} className="underline underline-offset-4 text-star">Use this signature</button>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="mt-4 underline underline-offset-4">Done</button>
        </div>
      )}
    </div>
  );
}