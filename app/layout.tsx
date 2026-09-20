import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}