import { slots } from '@/lib/clauses';
import Composer from './Composer';
import HandlePicker from '../component/HandlePicker';
import { readHandle } from '@/lib/visitor';

export default async function SendPage() {
  const handle = await readHandle();

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Write a message</h1>
      <p className="mt-2 text-sm text-gray-600">
        Pick one line for each part. Your message goes to someone having a hard time.
      </p>
      {handle ? (
        <Composer slots={slots} handle={handle} />
      ) : (
        <div className="mt-8">
          <p className="text-sm">Choose a name before you write.</p>
          <div className="mt-4">
            <HandlePicker current={null} />
          </div>
        </div>
      )}
    </main>
  );
}