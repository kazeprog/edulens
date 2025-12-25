import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'EduLens - 学習を、もっと効果的に',
  description: '試験日カウントダウンと単語学習システム。高校入試、大学入試、英検、TOEICなどの試験対策をサポート。',
  alternates: {
    canonical: 'https://edulens.jp',
  },
  openGraph: {
    title: 'EduLens - 学習を、もっと効果的に',
    description: '試験日カウントダウンと単語学習システム。あなたの目標達成をサポートする学習ツール。',
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
    <>
      <SiteHeader />
      <main>
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
          {/* Hero Section */}
          <section className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                学習を、<br className="sm:hidden" />もっと効果的に。
              </h1>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                試験日カウントダウンと単語学習システム。<br />
                あなたの目標達成をサポートする学習ツール。
              </p>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-12 sm:py-20 px-4 bg-slate-50 border-t border-slate-100">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-10 sm:mb-14">
                サービスを選ぶ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Countdown Card */}
                <Link
                  href="/countdown"
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <img
                        src="/CountdownLP.png"
                        alt="Countdown"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                      Countdown
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                      試験日までの残り時間を可視化。<br />
                      高校入試・大学入試・英検・TOEIC対応。
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm text-slate-500 mb-6">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        都道府県別入試日程
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        共通テスト・資格試験対応
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        SNSシェア機能
                      </li>
                    </ul>

                    {/* CTA */}
                    <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      詳しく見る
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Mistap Card */}
                <Link
                  href="/mistap"
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <img
                        src="/MistapLP.png"
                        alt="Mistap"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors">
                      Mistap
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                      間違えた単語に集中する学習システム。<br />
                      効率的な暗記で確実に記憶を定着。
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm text-slate-500 mb-6">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        間違い単語を自動記録
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        復習テスト自動生成
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        主要単語帳に対応
                      </li>
                    </ul>

                    {/* CTA */}
                    <span className="inline-flex items-center text-red-600 font-semibold group-hover:translate-x-1 transition-transform">
                      詳しく見る
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* EduTimer Card */}
                <Link
                  href="/EduTimer"
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:border-rose-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <img
                        src="/EdutimerLogo.png"
                        alt="EduTimer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-rose-600 transition-colors">
                      EduTimer
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                      ポモドーロテクニックで集中力UP。<br />
                      25分集中・5分休憩のサイクル学習。
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm text-slate-500 mb-6">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        無料で利用可能
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        学習時間を記録
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        セッション進捗管理
                      </li>
                    </ul>

                    {/* CTA */}
                    <span className="inline-flex items-center text-rose-600 font-semibold group-hover:translate-x-1 transition-transform">
                      今すぐ使う
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Black Lens Card */}
                <Link
                  href="/blacklens"
                  className="group relative bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-700 hover:shadow-xl hover:border-purple-500 transition-all duration-300 overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-900 to-slate-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <img
                        src="/BlacklensSquare.png"
                        alt="BlackLens"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors">
                      BlackLens
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                      勉強のストレスをためずに吐き出す<br />
                      コメントボード。
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 text-sm text-gray-500 mb-6">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        完全匿名投稿
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        「わかる」・「エール」リアクション
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        カテゴリ別悩み一覧
                      </li>
                    </ul>

                    {/* CTA */}
                    <span className="inline-flex items-center text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                      入る
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section >

          {/* About / SEO Section */}
          < section className="py-12 sm:py-16 px-4 bg-white" >
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-6 sm:p-12">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">EduLensについて</h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  EduLens（エデュレンズ）は、受験生や資格試験に挑むすべての人のための学習支援プラットフォームです。<br /><br />
                  <strong>Countdown</strong>で試験本番までの残り時間を可視化し、「あと何日あるか」を具体的に意識することで、漠然とした不安を「今日やるべき行動」に変えます。<br /><br />
                  <strong>Mistap</strong>では、間違えた単語に集中する新しい学習方式で、効率的な暗記をサポート。システム英単語、ターゲット、LEAPなど主要な単語帳に対応しています。<br /><br />
                  <strong>EduTimer</strong>は、ポモドーロテクニックを活用した集中タイマー。25分集中・5分休憩のサイクルで、効率的な学習をサポートします。<br /><br />
                  <strong>BlackLens</strong>は、受験生の悩みやストレスを匿名で吐き出せる掃きだめ板。「わかる」「エール」のリアクションで、同じ悩みを持つ仲間とつながれます。<br /><br />
                  あなたの目標達成を、4つのツールで支援します。
                </p>
              </div>
            </div>
          </section >
        </div >
      </main >
      <SiteFooter />
    </>
  );
}
