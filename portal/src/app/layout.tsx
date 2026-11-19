import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Somalia Humanitarian Intelligence & Localization Platform (2026)',
  description:
    'Comprehensive open-source geospatial and financial intelligence platform cross-analyzing UN OCHA FTS funding flows, HDX 3W Operational Presence, and IOM DTM Emergency Trends Tracking across all 18 regions and 90 districts of Somalia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100 antialiased">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
