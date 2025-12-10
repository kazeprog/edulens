import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
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
  // ▼▼▼ 【重要】この1行を追加してください！ ▼▼▼
  metadataBase: new URL('https://edulens.jp'),
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  title: "EduLens",
  description: "入試カウントダウン",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "EduLens",
    description: "入試カウントダウン",
    url: "https://edulens.jp",
    type: "website",
    siteName: "EduLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduLens",
    description: "入試カウントダウン",
  },
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
        <header className="w-full py-4 px-0 flex items-center justify-start sticky top-0 bg-white/80 backdrop-blur-sm z-50">
          {/* ロゴを画像の縦横サイズに合わせて表示（Next/Image を使わず <img> を利用） */}
          <Link href="/countdown" className="w-48 h-12 block hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="EduLens" decoding="async" className="w-full h-full object-contain" />
          </Link>
        </header>
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}