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
            入試カテゴリーを選択
          </h1>
          <p className="text-slate-500">
            目指すゴール（高校・大学）を選んで、合格へのカウントダウンを見てみましょう。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
            {/* バッジ削除済み */}
          </Link>
        </div>

      </div>
    </div>
  );
}