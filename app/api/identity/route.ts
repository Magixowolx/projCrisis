// src/app/api/identity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateVisitor } from '@/lib/visitor';
import { isValidHandle } from '@/lib/handles';
import { isValidSignature } from '@/lib/signatures';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { adjective, noun, signature } = (body ?? {}) as Record<string, unknown>;
  const update: Record<string, string> = {};

  if (adjective !== undefined || noun !== undefined) {
    if (!isValidHandle(adjective, noun)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    update.handle_adjective = adjective as string;
    update.handle_noun = noun as string;
  }

  if (signature !== undefined) {
    if (!isValidSignature(signature)) {
      return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
    }
    update.signature_emoji = signature;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to change' }, { status: 400 });
  }

  const visitorId = await getOrCreateVisitor();
  const { error } = await supabase.from('visitors').update(update).eq('id', visitorId);

  if (error) {
    console.error('identity save failed', error);
    return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}