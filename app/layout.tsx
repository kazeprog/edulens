import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | EduLens',
    default: 'EduLens - 学習を、もっと効果的に',
  },
  metadataBase: new URL('https://edulens.jp'),
  description: "試験日カウントダウンと単語学習システム",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'EduLens - 学習を、もっと効果的に',
    description: '試験日カウントダウンと単語学習システム',
    url: 'https://edulens.jp',
    siteName: 'EduLens',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/Xcard.png',
        width: 1200,
        height: 630,
        alt: 'EduLens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLens - 学習を、もっと効果的に',
    description: '試験日カウントダウンと単語学習システム',
    images: ['/Xcard.png'],
    creator: '@EduLensjp',
    site: '@EduLensjp',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
