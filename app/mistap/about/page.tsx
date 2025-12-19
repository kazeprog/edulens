'use client';

import Link from 'next/link';
import Background from '@/components/mistap/Background';

export default function AboutPage() {
  return (
    <Background>
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* ヒーローセクション */}
          <section className="text-center mb-16">
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/50">
              <h1 className="text-5xl font-bold text-gray-800 mb-4" translate="no">
                Mistap
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                中学・高校生のための英単語テスト練習アプリ
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                LEAP、ターゲット、システム英単語、古文単語帳などの有名教材に対応。効率的な単語学習で、英語力を確実にアップさせましょう。
              </p>
              <Link
                href="/mistap"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg font-semibold inline-block transition-colors"
              >
                今すぐ始める
              </Link>
            </div>
          </section>

          {/* 特徴セクション */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Mistapの特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-8">

              {/* 特徴1 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/50">
                <div className="text-4xl mb-4 text-center">📚</div>
                <h3 className="text-xl font-semibold mb-3 text-center">豊富な教材</h3>
                <p className="text-gray-700 text-center">
                  LEAP、ターゲット1200/1900、システム英単語、古文単語帳など、中学・高校で使われる主要教材に完全対応。
                </p>
              </div>

              {/* 特徴2 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/50">
                <div className="text-4xl mb-4 text-center">⚡</div>
                <h3 className="text-xl font-semibold mb-3 text-center">カスタマイズ可能</h3>
                <p className="text-gray-700 text-center">
                  単語の範囲や出題数を自由に設定。あなたのペースに合わせた学習が可能です。
                </p>
              </div>

              {/* 特徴3 */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/50">
                <div className="text-4xl mb-4 text-center">📊</div>
                <h3 className="text-xl font-semibold mb-3 text-center">学習記録</h3>
                <p className="text-gray-700 text-center">
                  テスト結果を自動保存。間違えた単語の復習や学習履歴の確認で効率的な学習を実現。
                </p>
              </div>
            </div>
          </section>

          {/* 使い方セクション */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              使い方
            </h2>
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/50">
              <div className="grid md:grid-cols-4 gap-6">

                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">ユーザー登録</h3>
                  <p className="text-sm text-gray-600">
                    メールアドレスで簡単登録
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">テスト設定</h3>
                  <p className="text-sm text-gray-600">
                    教材・範囲・問題数を選択
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">テスト実行</h3>
                  <p className="text-sm text-gray-600">
                    間違えた単語をタップ
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">結果確認</h3>
                  <p className="text-sm text-gray-600">
                    成績保存・復習計画
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 対応教材セクション */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              対応教材
            </h2>
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/50">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">中学生向け</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      過去形
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      過去形、過去分詞形
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      絶対覚える英単語150
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      ターゲット1800
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">高校生向け</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      LEAP
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      ターゲット1200
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      システム英単語
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      ターゲット1900
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      古文単語帳各種
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      その他多数の教材
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">社会人・大学生向け</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      TOEIC L&R TEST 出る単特急金のフレーズ
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTAセクション */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 shadow-xl text-white">
              <h2 className="text-3xl font-bold mb-4">
                今すぐMistapで英語学習を始めよう！
              </h2>
              <p className="text-lg mb-6 opacity-90">
                無料で始められます。効率的な英単語学習で成績アップを目指しましょう。
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  href="/mistap"
                  className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-semibold inline-block transition-colors"
                >
                  無料で始める
                </Link>
                <Link
                  href="/mistap/test-setup"
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 rounded-xl text-lg font-semibold inline-block transition-colors"
                >
                  デモを試す
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Background>
  );
}