import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '3D ATLAS — Autonomous Planetary Intelligence & Logistics Experience',
  description:
    'A cinematic, scroll-driven WebGL command center and global planetary telemetry experience inspired by Awwwards benchmarks and Stonic AI.',
  keywords: [
    '3D Atlas',
    'WebGL',
    'Three.js',
    'GSAP',
    'Planetary Intelligence',
    'Logistics Telemetry',
    'Interactive Globe',
  ],
  authors: [{ name: '3D Atlas Creative Lab' }],
  openGraph: {
    title: '3D ATLAS — Autonomous Planetary Intelligence',
    description: 'Cinematic 3D scroll-driven planetary telemetry experience.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-black text-slate-100 font-sans min-h-screen selection:bg-cyan-500 selection:text-black antialiased relative">
        {children}
      </body>
    </html>
  );
}
