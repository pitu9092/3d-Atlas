import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'United Carriers — One operator. Every leg of the journey.',
  description:
    'Freight forwarding, land transport, and customs brokerage, unified across APAC under one accountable team. End-to-end supply chain predictability and transparency.',
  keywords: [
    'United Carriers',
    'Freight Forwarding',
    'Customs Brokerage',
    'Air Freight',
    'Ocean Freight',
    'Warehousing 3PL',
    'Project Cargo',
    'Interstate Transport',
    'APAC Logistics',
  ],
  authors: [{ name: 'United Carriers Group Pty Ltd' }],
  openGraph: {
    title: 'United Carriers — One operator. Every leg of the journey.',
    description:
      'Freight forwarding, land transport, and customs brokerage, unified across APAC under one accountable team.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="bg-black text-white antialiased relative min-h-screen">
        {children}
      </body>
    </html>
  );
}
