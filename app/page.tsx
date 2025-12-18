import Link from 'next/link';
import type { Metadata } from 'next';
import CategoryCard from '@/components/CategoryCard';

export const metadata: Metadata = {
  title: 'EduLens - 入試・資格試験のカウントダウン',
  description: '高校入試、大学入試、英検、TOEICなどの試験日まであと何日？目標に向かって頑張る受験生のためのカウントダウンサイトです。',
  alternates: {
    canonical: 'https://edulens.jp',
  },
  openGraph: {
    title: 'EduLens - 入試・資格試験のカウントダウン',
    description: 'あと何日で本番？高校入試、大学共通テスト、英検など、あなたの「勝負の日」までの時間を可視化します。',
    url: 'https://edulens.jp',
    type: 'website',
    siteName: 'EduLens',
    images: [
      {
        url: '/Xcard.png',
        width: 1200,
        height: 630,
        alt: 'EduLens',
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            その日は、<br className="sm:hidden" />着実に近づいている。
          </h1>
          <p className="text-base sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            試験本番までの残り時間を正確に把握し、<br />
            今日やるべきことに集中するためのカウントダウンツール。
          </p>


        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 sm:py-16 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-8 sm:mb-12">
            カテゴリーから探す
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* 高校入試 */}
            <CategoryCard
              href="/countdown/highschool"
              color="blue"
              icon={
                <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              }
              title="高校入試"
              description="都道府県別の公立高校入試日程"
            />

            {/* 大学入試 */}
            <CategoryCard
              href="/countdown/university"
              color="indigo"
              icon={
                <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              }
              title="大学入試"
              description="共通テスト・個別試験日程"
            />

            {/* 英検 */}
            <CategoryCard
              href="/countdown/eiken"
              color="emerald"
              icon={
                <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              }
              title="英検 (実用英語技能検定)"
              description="従来型・S-CBT試験日程"
            />

            {/* TOEIC */}
            <CategoryCard
              href="/countdown/toeic"
              color="sky"
              icon={
                <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
              title="TOEIC L&R"
              description="公開テスト日程"
            />

            {/* TOEFL */}
            <CategoryCard
              href="/countdown/toefl"
              color="teal"
              icon={
                <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              }
              title="TOEFL iBT"
              description="テスト日程"
            />

          </div>
        </div>
      </section>

      {/* About / SEO Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <div className="bg-blue-50 rounded-3xl p-6 sm:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">EduLensについて</h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
              EduLens（エデュレンズ）は、受験生や資格試験に挑むすべての人のための、シンプルで使いやすい試験日カウントダウンツールです。<br />
              「あと何日あるか」を具体的に意識することで、漠然とした不安を「今日やるべき行動」に変えることができます。<br /><br />
              高校入試、大学共通テスト、英検、TOEIC、TOEFLなど、主要な試験スケジュールに対応。あなたの目標達成を時間管理の面からサポートします。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------------
// Sub Component
// --------------------------------------------------------


