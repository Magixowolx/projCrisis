import Link from 'next/link';
import Receive from './component/Receive';
import IdentityPanel from './component/Identity';
import { getOrCreateVisitor, readIdentity } from '@/lib/visitor';

export default async function Home() {
  await getOrCreateVisitor();
  const identity = await readIdentity();

return (
  <>
    <header className="site-header relative flex flex-wrap items-center justify-between gap-3 px-4 pb-2 pt-5 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
      <Link href="/" className="text-lg font-medium tracking-wide text-star-dim">Project Crisis</Link>
      {identity && <IdentityPanel identity={identity} compact />}
    </header>

    <main className="flex flex-1 flex-col items-center justify-center px-8 sm:px-10 lg:px-16">
      <Receive />

      <div className="mt-6 border-t pt-3">
        <Link href="/send" className="font-sans inline-block text-sm text-star-dim underline">
          Write a message for someone else
        </Link>
      </div>
    </main>
  </>

);
}
