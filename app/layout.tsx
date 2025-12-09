import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "EduLens",
  description: "入試カウントダウン",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        <header className="w-full py-4 px-0 flex items-center justify-start sticky top-0 bg-white/80 backdrop-blur-sm z-50">
          {/* ロゴを画像の縦横サイズに合わせて表示（Next/Image を使わず <img> を利用） */}
          <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="EduLens" decoding="async" className="w-full h-full object-contain" />
          </Link>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
