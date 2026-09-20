import {NextRequest, NextResponse} from 'next/server';
import {supabase} from '@/lib/supabase';
import {getOrCreateVisitor} from '@/lib/visitor';
import {isValidHandle} from '@/lib/handles';
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: 'Invalid JSON'}, {status: 400});
    }
    const {adjective, noun} = (body ?? {}) as Record<string, unknown>;
    if (!isValidHandle(adjective, noun)) {
        return NextResponse.json({error: 'Invalid handle'}, {status: 400});
    }
    const visitorId = await getOrCreateVisitor();
    const {error} = await supabase
    .from('visitors')
    .update({handle_adjective: adjective, handle_noun: noun,})
    .eq('id', visitorId);

    if (error) {
        console.error('handle update failed', error);
        return NextResponse.json({error: 'Could not save handle'}, {status: 500});
    }
    return NextResponse.json({ok: true}, {status: 201});
}