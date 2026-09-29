import { slots } from '@/lib/clauses';
import Composer from './Composer';
import { readHandle, readIdentity, getOrCreateVisitor } from '@/lib/visitor';
import { readUnreported } from '@/lib/reads';

export default async function SendPage() {
  const handle = await readHandle();
  const identity = await readIdentity();
  const visitorID = await getOrCreateVisitor();
  const unreported = await readUnreported(visitorID);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold">Write a message</h1>
      <p className="mt-2 text-sm text-gray-600">
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
        <p className="text-[0.95rem] text-star-dim">
          {unreported === 1
            ? 'Someone read your message.'
            : `${unreported} people read your messages.`}
        </p>
      )}
    </main>
  );
}