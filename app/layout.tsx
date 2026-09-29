import type { Metadata } from 'next';
import './global.css';
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
    <html lang="en">
      <body className="bg-night text-star">
        <div className="flex min-h-dvh flex-col">
          {children}

          <footer className="px-6 pb-6 pt-5 text-center text-sm">
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