'use client';

import { useState } from 'react';
import Link from 'next/link';
import Receive from './Receive';

export default function HomeFeed() {
  const [isReading, setIsReading] = useState(false);
  const [showFinalFollowup, setShowFinalFollowup] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const note = repeat
    ? 'These are still yours. New ones will be here later.'
    : 'These were written for you. They won\u2019t be shown again.';

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 sm:px-10 lg:px-16">
      <Receive
        onFinalMessageReady={setShowFinalFollowup}
        onReadingChange={setIsReading}
        onRepeatChange={setRepeat}
      />

      <div className={`${isReading ? (showFinalFollowup ? 'rise' : 'invisible') : ''} mt-6 text-center`}>
        {isReading ? (
          <>
            <p className="text-[0.95rem] text-star-dim">{note}</p>
            <div className="mt-3 border-t pt-3">
              <Link href="/send" className="font-sans text-sm text-star-dim underline">
                Write a message for someone else
              </Link>
            </div>
          </>
        ) : (
          <div className="border-t pt-3">
            <Link href="/send" className="font-sans text-sm text-star-dim underline">
              Write a message for someone else
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
