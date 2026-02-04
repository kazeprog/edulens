import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AdLayoutWrapper from "@/components/AdLayoutWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import AdSenseScript from "@/components/AdSenseScript";

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
  description: "試験日カウントダウンとAI添削サービス",
  openGraph: {
    description: '試験日カウントダウンとAI添削サービス',
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
    description: '試験日カウントダウンとAI添削サービス',
    images: ['/Xcard.png'],
    creator: '@EduLensjp',
    site: '@EduLensjp',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Favicon - explicit for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JQ63VXZTM4"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JQ63VXZTM4');
            `,
          }}
        />


      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800`}
      >
        <ScrollToTop />
        <AuthProvider>
          <AdSenseScript />
          <AdLayoutWrapper>
            {children}
          </AdLayoutWrapper>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
