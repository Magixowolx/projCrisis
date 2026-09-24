'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { randomHandles, type Handle } from '@/lib/handles';

function rollOne(): Handle {
  return randomHandles(1)[0];
}

function same(a: Handle, b: Handle): boolean {
  return a.adjective === b.adjective && a.noun === b.noun;
}

export default function HandlePicker({ current }: { current: Handle | null }) {
  const router = useRouter();

  const [editing, setEditing] = useState(current === null);
  const [candidate, setCandidate] = useState<Handle>(() => current ?? rollOne());
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  function reroll() {
    setCandidate((prev) => {
      let next = rollOne();
      // Never show the same name twice in a row — a button that appears
      // to do nothing reads as broken. Bounded so it can't spin forever.
      for (let i = 0; i < 5 && same(next, prev); i++) next = rollOne();
      return next;
    });
    setFailed(false);
  }

  function startEditing() {
    setFailed(false);
    setEditing(true);
  }

  async function approve() {
    setSaving(true);
    setFailed(false);
    try {
      const res = await fetch('/api/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      if (!res.ok) {
        setFailed(true);
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  if (!editing && current) {
    return (
      <p className="text-sm text-gray-600">
        You sign as{' '}
        <span className="text-gray-900">
          {current.adjective} {current.noun}
        </span>
        .{' '}
        <button onClick={startEditing} className="underline">
          Change
        </button>
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600">You&apos;ll sign your messages as</p>

      <p className="mt-2 text-xl">
        {candidate.adjective} {candidate.noun}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={approve}
          disabled={saving}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>

        <button
          onClick={reroll}
          disabled={saving}
          className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
        >
          Reroll
        </button>

        {current && (
          <button
            onClick={() => setEditing(false)}
            disabled={saving}
            className="text-sm underline"
          >
            Cancel
          </button>
        )}
      </div>

      {failed && (
        <p className="mt-2 text-sm text-red-600">Could not save that. Try again.</p>
      )}
    </div>
  );
}
