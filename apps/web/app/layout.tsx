import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JourneyMan — AI Workforce Platform',
  description: 'Hire, onboard, manage, and grow AI employees that work alongside humans.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
