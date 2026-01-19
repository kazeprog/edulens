import type { Metadata } from 'next';
import { Suspense } from 'react';
import UniversityClient from './UniversityClient';

function getTargetExamYear() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  return currentMonth >= 4 ? currentYear + 1 : currentYear;
}

export async function generateMetadata(): Promise<Metadata> {
  const targetYear = getTargetExamYear();
  const reiwaYear = targetYear - 2018;
  const title = `大学入試カウントダウン${targetYear} - 共通テスト・国公立日程 | EduLens`;
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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">読み込み中...</div>}>
      <UniversityClient />
    </Suspense>
  );
}