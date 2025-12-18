import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
    default: 'EduLens - 入試・資格試験のカウントダウン',
  },
  description: "入試カウントダウン",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'EduLens - 入試・資格試験のカウントダウン',
    description: '入試カウントダウン',
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
    title: 'EduLens - 入試・資格試験のカウントダウン',
    description: '入試カウントダウン',
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
        <header className="w-full py-4 px-0 flex items-center justify-start sticky top-0 bg-white/80 backdrop-blur-sm z-50">
          {/* ロゴを画像の縦横サイズに合わせて表示（Next/Image を使わず <img> を利用） */}
          <Link href="/" className="w-48 h-12 block hover:opacity-80 transition-opacity relative">
            <Image
              src="/logo.png"
              alt="EduLens"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </header>
        <main>
          {children}
        </main>
        <footer className="w-full py-8 text-center border-t border-slate-100 bg-slate-50">
          <nav className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-slate-800 hover:underline">利用規約</Link>
            <Link href="/privacy" className="hover:text-slate-800 hover:underline">プライバシーポリシー</Link>
            <Link href="/contact" className="hover:text-slate-800 hover:underline">お問い合わせ</Link>
          </nav>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} EduLens
            </p>
            <p className="text-xs text-slate-400">
              Amazonのアソシエイトとして、EduLensは適格販売により収入を得ています。
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
