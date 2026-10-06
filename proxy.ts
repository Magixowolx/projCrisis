import { randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'pc_visitor';
const ONE_YEAR = 60 * 60 * 24 * 365;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_NAME)?.value;

  if (existing && UUID_RE.test(existing)) {
    return NextResponse.next();
  }

  const id = randomUUID();
  // Make the new ID visible to cookies() during this same page render.
  request.cookies.set(COOKIE_NAME, id);

  const response = NextResponse.next({ request });
  response.cookies.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ONE_YEAR,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
