'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { randomHandles, type Handle } from '@/lib/handles';

export default function HandlePicker({ current }: { current: Handle | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(current === null);
  const [options, setOptions] = useState<Handle[]>(() => randomHandles(6));
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function save(h: Handle) {
    setSaving(true);
    setFailed(false);
    try {
      const res = await fetch('/api/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(h),
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
        You sign as <span className="text-gray-900">{current.adjective} {current.noun}</span>.{' '}
        <button onClick={() => setEditing(true)} className="underline">
          Change
        </button>
      </p>
    );
  }

return (
    <div>
      <p className="text-sm font-medium">Choose how you sign your messages</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((h) => (
          <button
            key={`${h.adjective} ${h.noun}`}
            onClick={() => save(h)}
            disabled={saving}
            className="rounded-full border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
          >
            {h.adjective} {h.noun}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <button onClick={() => setOptions(randomHandles(6))} disabled={saving} className="underline">
          Show me different names
        </button>
        {current && (
          <button onClick={() => setEditing(false)} className="underline">
            Keep {current.adjective} {current.noun}
          </button>
        )}
      </div>
      {failed && <p className="mt-2 text-sm text-red-600">Could not save that. Try again.</p>}
    </div>
  );
}