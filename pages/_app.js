import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DM_Sans, DM_Mono } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${dmSans.variable} ${dmMono.variable}`}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}