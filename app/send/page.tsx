import { slots } from '@/lib/clauses';
import Composer from './Composer';
import { readHandle, readIdentity, getOrCreateVisitor } from '@/lib/visitor';
import { readUnreported } from '@/lib/reads';

export default async function SendPage() {
  const visitorID = await getOrCreateVisitor();
  const handle = await readHandle();
  const identity = await readIdentity();

  const unreported = await readUnreported(visitorID);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 p-6">
      <h1 className="text-2xl font-semibold">Write a message</h1>
      <p className="mt-2 text-sm text-star-dim">
        Pick one line for each part. Your message goes to someone having a hard time.
      </p>
      {identity ? (
        <Composer slots={slots} identity={identity} />
      ) : (
        <div className="mt-8">
          <p className="text-sm">Choose a name before you write.</p>
        </div>
      )}
      {unreported > 0 && (
        <p className="mt-3 text-[0.95rem] text-star-dim">
          {unreported === 1
            ? 'Someone read your message.'
            : `${unreported} people read your messages.`}
        </p>
      )}
    </main>
  );
}