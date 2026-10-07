import type { Metadata } from 'next';
import { Caveat } from 'next/font/google';
import './global.css';

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Project Crisis',
  description: 'A message from someone who has been there.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={caveat.variable}>
      <body className="bg-night text-star">
        <div className="flex min-h-dvh flex-col">
          {children}

          <footer className="px-6 pb-6 pt-5 text-left text-sm text-star-dim">
            If you need someone now,{' '}
            <a
              href="https://findahelpline.com"
              className="underline underline-offset-4 hover:text-star-dim"
            >
              here are people who will listen
            </a>
            .
          </footer>
        </div>
      </body>
    </html>
  );
}