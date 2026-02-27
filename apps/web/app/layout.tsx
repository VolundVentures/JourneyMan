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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-900 text-surface-100 antialiased font-body">
        {children}
      </body>
    </html>
  );
}
