import { supabase } from '@/lib/supabase';

// src/lib/reads.ts
export async function readUnreported(visitorId: string): Promise<number> {
  const { data } = await supabase
    .from('messages')
    .select('views, views_reported')
    .eq('sender_visitor_id', visitorId);

  return (data ?? []).reduce(
    (sum, m) => sum + Math.max(0, m.views - m.views_reported),
    0
  );
}

export async function markReported(visitorId: string) {
  await supabase.rpc('mark_reported', { p_visitor: visitorId });
}