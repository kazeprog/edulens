import type { Metadata } from 'next';
import { Suspense } from 'react';
import UniversityClient from './UniversityClient';
import { getTargetExamYear } from '@/lib/date-utils';

export async function generateMetadata(): Promise<Metadata> {
  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;
  const title = `大学入試カウントダウン${targetYear} - 共通テスト・国公立日程`;
  const description = `${targetYear}年度（令和${reiwaYear}年度）の大学入学共通テスト、国公立大学2次試験（前期・後期）の日程と残り日数を表示します。`;
  const url = 'https://edulens.jp/countdown/university';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'website',
      siteName: 'EduLens',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  };
}

export default function UniversityTopPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "EduLens",
        "item": "https://edulens.jp"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "入試選択",
        "item": "https://edulens.jp/countdown"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "大学入試一覧",
        "item": "https://edulens.jp/countdown/university"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="flex justify-center mb-8 h-5 bg-slate-200 rounded animate-pulse w-64 mx-auto"></div>
            {/* Tabs Skeleton */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm inline-flex gap-1">
                <div className="w-20 h-10 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-20 h-10 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
            {/* Title Skeleton */}
            <div className="text-center mb-12">
              <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-10 w-48 bg-slate-200 rounded animate-pulse mx-auto mt-2"></div>
              <div className="h-4 w-96 bg-slate-200 rounded animate-pulse mx-auto mt-4"></div>
            </div>
            {/* Ad Placeholder (matches GoogleAdsense min-height) */}
            <div className="flex justify-center w-full text-center mt-8 mb-12">
              <div className="w-full max-w-[100%] h-[280px] bg-slate-100 animate-pulse rounded"></div>
            </div>
            {/* Content Loading */}
            <div className="text-center py-12 text-slate-400">読み込み中...</div>
          </div>
        </div>
      }>
        <UniversityClient />
      </Suspense>
    </>
  );
}
