// src/app/api/receive/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateVisitor } from '@/lib/visitor';
import { clauseText } from '@/lib/clauses';
import { RECEIVE_COOLDOWN_MS, remainingMs } from '@/lib/limits';

type Row = {
  id: number;
  recognition_id: string;
  shared_id: string;
  encouragement_id: string;
  hope_id: string;
  country: string | null;
  handle_adjective: string | null;
  handle_noun: string | null;
};

const COLUMNS =
  'id, recognition_id, shared_id, encouragement_id, hope_id, country, handle_adjective, handle_noun';

function shape(rows: Row[]) {
  return rows
    .map((row) => ({
      id: row.id,
      country: row.country,
      handle:
        row.handle_adjective && row.handle_noun
          ? `${row.handle_adjective} ${row.handle_noun}`
          : null,
      lines: [
        clauseText('recognition', row.recognition_id),
        clauseText('shared', row.shared_id),
        clauseText('encouragement', row.encouragement_id),
        clauseText('hope', row.hope_id),
      ],
    }))
    .filter((m) => m.lines.every((l) => l !== null));
}

export async function POST() {
  const visitorId = await getOrCreateVisitor();

  const { data: visitor } = await supabase
    .from('visitors')
    .select('last_received_at, last_claim_ids')
    .eq('id', visitorId)
    .maybeSingle();

  const waiting = remainingMs(visitor?.last_received_at ?? null, RECEIVE_COOLDOWN_MS);

  // Inside the cooldown: hand back the same messages. No new claim.
  if (waiting > 0 && visitor?.last_claim_ids?.length) {
    const { data } = await supabase
      .from('messages')
      .select(COLUMNS)
      .in('id', visitor.last_claim_ids);

    return NextResponse.json({
      messages: shape((data ?? []) as Row[]),
      repeat: true,
      waitingMs: waiting,
    });
  }

  // Outside the cooldown: claim fresh ones.
  const { data, error } = await supabase.rpc('claim_messages', {
    p_limit: 3,
    p_view_cap: 2,
  });

  if (error) {
    console.error('claim_messages failed', error);
    return NextResponse.json({ error: 'Could not fetch messages' }, { status: 500 });
  }

  const rows = (data ?? []) as Row[];

  // Empty pool: do NOT start a cooldown. They received nothing.
  if (rows.length === 0) {
    return NextResponse.json({ messages: [], repeat: false });
  }

  await supabase
    .from('visitors')
    .update({
      last_received_at: new Date().toISOString(),
      last_claim_ids: rows.map((r) => r.id),
    })
    .eq('id', visitorId);

  return NextResponse.json({ messages: shape(rows), repeat: false });
}