import Link from 'next/link';
import type { Metadata } from 'next';

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
        
        {/* ▼▼▼ 指定されたテキストに変更済み ▼▼▼ */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            試験カテゴリーを選択
          </h1>
          <p className="text-slate-500">
            目指すゴールを選んで、合格へのカウントダウンを見てみましょう。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 高校入試へのリンク */}
          <Link 
            href="/countdown/highschool"
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center h-64"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* 高校アイコン */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">高校入試</h2>
            <p className="text-slate-400 text-sm">都道府県別の公立高校入試日程</p>
          </Link>

          {/* 大学入試へのリンク */}
          <Link 
            href="/countdown/university"
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all text-center flex flex-col items-center justify-center h-64"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* 大学アイコン */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">大学入試</h2>
            <p className="text-slate-400 text-sm">共通テスト・個別試験日程</p>
          </Link>

          {/* 資格試験へのリンク */}
          <Link 
            href="/countdown/eiken"
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-200 transition-all text-center flex flex-col items-center justify-center h-64"
          >
            <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* 資格アイコン */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">英検</h2>
            <p className="text-slate-400 text-sm">英検の試験日程・カウントダウン</p>
          </Link>

          {/* TOEICへのリンク */}
          <Link 
            href="/countdown/toeic"
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-200 transition-all text-center flex flex-col items-center justify-center h-64"
          >
            <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* TOEICアイコン (Globe) */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">TOEIC L&R</h2>
            <p className="text-slate-400 text-sm">TOEIC公開テストの日程・カウントダウン</p>
          </Link>

          {/* TOEFLへのリンク */}
          <Link 
            href="/countdown/toefl"
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-200 transition-all text-center flex flex-col items-center justify-center h-64"
          >
            <div className="w-16 h-16 bg-sky-50 text-sky-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {/* TOEFLアイコン (Book) */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">TOEFL iBT</h2>
            <p className="text-slate-400 text-sm">TOEFL iBTテストの日程・カウントダウン</p>
          </Link>
        </div>

      </div>
    </div>
  );
}