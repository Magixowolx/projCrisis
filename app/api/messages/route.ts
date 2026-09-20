import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateVisitor } from '@/lib/visitor';
import { isValidClause } from '@/lib/clauses';
import { isValidHandle } from '@/lib/handles';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { recognition, shared, encouragement, hope, handleAdjective, handleNoun } =
    (body ?? {}) as Record<string, unknown>;

  if (
    !isValidClause('recognition', recognition) ||
    !isValidClause('shared', shared) ||
    !isValidClause('encouragement', encouragement) ||
    !isValidClause('hope', hope)
  ) {
    return NextResponse.json({ error: 'Invalid selection' }, { status: 400 });
  }

  const visitorId = await getOrCreateVisitor();
  const {data: visitor } = await supabase
    .from('visitors')
    .select('handle_adjective, handle_noun')
    .eq('id', visitorId)
    .maybeSingle();
  if (!visitor?.handle_adjective || !visitor?.handle_noun) {
    return NextResponse.json({ error: 'Choose a name first' }, 
      { status: 400 }
    );
  }
  const country = request.headers.get('x-vercel-ip-country');

  const { error } = await supabase.from('messages').insert({
    recognition_id: recognition,
    shared_id: shared,
    encouragement_id: encouragement,
    hope_id: hope,
    country,
    sender_visitor_id: visitorId,
    handle_adjective: visitor.handle_adjective,
    handle_noun: visitor.handle_noun,
  });


  if (error) {
    console.error('message insert failed', error);
    return NextResponse.json({ error: 'Could not save message' }, { status: 500 });
  }
    return NextResponse.json({ ok: true }, { status: 201 });
}