import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateVisitor } from '@/lib/visitor';
import { clauseText } from '@/lib/clauses';


type ClaimedRow = {  // represents a row in the claimed table
  id: number;
  recognition_id: string;
  shared_id: string;
  encouragement_id: string;
  hope_id: string;
  country: string | null;
  handle_adjective: string | null;
  handle_noun: string | null;
};

export async function POST() {
  await getOrCreateVisitor(); // ensure visitor exists

    const { data, error } = await supabase.rpc('claim_messages', {
    p_limit: 3, // sets limit of 3 messages
    p_view_cap: 2, //messages should have been viewed no mroe than twice
  });
  if (error) { //if cannot find data, return error
    console.error('claim_messages failed', error);
    return NextResponse.json({ error: 'Could not fetch messages' }, { status: 500 });
  }
    const rows = (data ?? []) as ClaimedRow[];
    const messages = rows
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
    // Drop anything whose clause IDs no longer resolve. See "Clause IDs are permanent" below.
        .filter((m): m is { id: number; country: string | null; handle: string | 
        null; lines: string[] } =>
      m.lines.every((line) => line !== null)
    );

  return NextResponse.json({ messages });
}