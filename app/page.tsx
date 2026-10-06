import Link from 'next/link';
import Receive from './component/Receive';
import IdentityPanel from './component/Identity';
import { getOrCreateVisitor, readIdentity } from '@/lib/visitor';

export default async function Home() {
  await getOrCreateVisitor();
  const identity = await readIdentity();

return (
  <>
    <header className="flex items-start justify-between px-6 pt-6">
      <Link href="/" className="text-sm font-medium tracking-wide text-star">Project Crisis</Link>
      {identity && <IdentityPanel identity={identity} compact />}
    </header>

    <main className="flex flex-1 flex-col items-center justify-center px-6">
    <Receive />

    <div className="mt-12 border-t pt-3">
      <Link href="/send" className="font-sans inline-block text-sm underline">
        Write a message for someone else
      </Link>
    </div>
  </main>
  </>

);
}
