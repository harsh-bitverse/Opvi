import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OPVI - AI-Native Opportunity Discovery Platform',
  description: 'Ranked list of verified elite opportunities from trusted publishers.',
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
