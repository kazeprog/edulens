import Link from 'next/link';
import type { Metadata } from 'next';
import CategoryCard from '@/components/CategoryCard';
import GoogleAdsense from '@/components/GoogleAdsense';

export const metadata: Metadata = {
  title: '入試カテゴリー選択 | EduLens',
  description: '高校入試、大学入試それぞれのカウントダウンを確認できます。',
  openGraph: {
    title: '入試カテゴリー選択 | EduLens',
    description: '高校入試、大学入試それぞれのカウントダウンを確認できます。',
    url: 'https://edulens.jp/countdown',
    type: 'website',
    siteName: 'EduLens',
  },
  twitter: {
    card: 'summary_large_image',
    title: '入試カテゴリー選択 | EduLens',
    description: '高校入試、大学入試それぞれのカウントダウンを確認できます。',
  },
};

export default function CountdownHubPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-4">
            試験カテゴリーを選択
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            目指すゴールを選んで、合格へのカウントダウンを見てみましょう。
          </p>
        </div>

        {/* AdSense Unit */}
        <div className="mb-8">
          <GoogleAdsense
            style={{ display: 'block', minHeight: '100px', width: '100%' }}
            format="horizontal"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* 高校入試へのリンク */}
          <CategoryCard
            href="/countdown/highschool"
            color="blue"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            }
            title="高校入試"
            description="都道府県別の公立高校入試日程"
          />

          {/* 大学入試へのリンク (indigo) */}
          <CategoryCard
            href="/countdown/university"
            color="indigo"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            }
            title="大学入試"
            description="共通テスト・個別試験日程"
          />

          {/* 英検へのリンク (emerald - old sky) */}
          <CategoryCard
            href="/countdown/eiken"
            color="emerald"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            }
            title="英検"
            description="英語検定試験日程"
          />

          {/* TOEICへのリンク (sky) */}
          <CategoryCard
            href="/countdown/toeic"
            color="sky"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
            title="TOEIC L&R"
            description="TOEIC公開テストの日程・カウントダウン"
          />

          {/* TOEFLへのリンク (teal - old sky) */}
          <CategoryCard
            href="/countdown/toefl"
            color="teal"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            }
            title="TOEFL iBT"
            description="TOEFL iBTテストの日程・カウントダウン"
          />

          {/* その他資格へのリンク (rose) */}
          <CategoryCard
            href="/countdown/qualification"
            color="rose"
            icon={
              <svg className="w-6 h-6 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            }
            title="資格試験"
            description="医療・法律・IT・金融など様々な試験日程"
          />
        </div>

        <div className="mt-8 text-center pt-8 border-t border-slate-200">
          <Link href="/" prefetch={false} className="text-blue-600 hover:underline">
            &larr; EduLens トップへ戻る
          </Link>
        </div>

      </div>
    </div>
  );
}