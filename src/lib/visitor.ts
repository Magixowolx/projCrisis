import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { supabase } from './supabase';
import { Handle } from './handles';

const COOKIE_NAME = 'pc_visitor';
const ONE_YEAR = 60 * 60 * 24 * 365;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function readVisitor(): Promise<string | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  return id && UUID_RE.test(id) ? id : null;
}

export async function readHandle(): Promise<Handle | null> {
  const id = await readVisitor();
  if (!id) return null;
  const { data } = await supabase
    .from('visitors')
    .select('handle_adjective, handle_noun')
    .eq('id', id)
    .maybeSingle();

  if (!data?.handle_adjective || !data?.handle_noun) return null;
  return { adjective: data.handle_adjective, noun: data.handle_noun };
}

export async function getOrCreateVisitor(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;

  if (existing && UUID_RE.test(existing)) {
    // The cookie can outlive the database row (wiped dev data, etc).
    await supabase
      .from('visitors')
      .upsert({ id: existing }, { onConflict: 'id', ignoreDuplicates: true });
    return existing;
  }

  const id = randomUUID();
  await supabase.from('visitors').insert({ id });

  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  });

  return id;
}