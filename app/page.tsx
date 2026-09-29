import Link from 'next/link';
import Receive from './component/Receive';
import IdentityPanel from './component/Identity';
import { readVisitor, readIdentity } from '@/lib/visitor';

export default async function Home() {
  const visitorId = await readVisitor();
  const identity = visitorId ? await readIdentity() : null;

return (
  <>
    <header className="flex justify-end px-6 pt-6">
      {identity && <IdentityPanel identity={identity} compact />}
    </header>

    <main className="flex flex-1 flex-col items-center justify-center px-6">
    <h1 className="text-2xl font-semibold">Project Crisis</h1>
    <Receive />

    <div className="mt-12 border-t pt-6">
      <Link href="/send" className="mt-10 inline-block text-sm underline">
        Write a message for someone else
      </Link>
    </div>
  </main>
  </>

);
}
