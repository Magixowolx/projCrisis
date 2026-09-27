import Link from 'next/link';
import Receive from './component/Receive';
import IdentityPanel from './component/Identity';
import { readHandle, readIdentity } from '@/lib/visitor';

export default async function Home() {
  const identity = await readIdentity();

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Project Crisis</h1>
      <Receive />

      <div className="mt-12 border-t pt-6">
      {identity && (
        <div className="mt-20">
          <IdentityPanel identity={identity} compact />
        </div>
      )}
        <Link href="/send" className="mt-10 inline-block text-sm underline">
          Write a message for someone else
        </Link>
      </div>
    </main>
  );
}
