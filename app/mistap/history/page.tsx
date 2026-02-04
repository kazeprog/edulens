'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';
import GoogleAdsense from '@/components/GoogleAdsense';

interface IncorrectWord {
  word_number: number;
  word: string;
  meaning: string;
}

interface TestResult {
  id: string;
  user_id: string;
  selected_text: string | null;
  start_num: number | null;
  end_num: number | null;
  total: number;
  correct: number;
  incorrect_count: number;
  incorrect_words: IncorrectWord[] | null;
  created_at: string;
  unit: string | null;
  mode: 'word-meaning' | 'meaning-word' | null;
}

interface TextbookStats {
  textName: string;
  totalTests: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  recentResults: TestResult[];
}

interface IncorrectWordsSectionProps {
  words: IncorrectWord[];
  count: number;
}

function IncorrectWordsSection({ words, count }: IncorrectWordsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl border border-red-200 transition-all duration-200 font-medium"
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          間違えた単語 ({count}個) を表示
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
        }`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
          {words.map((w: IncorrectWord, index) => (
            <div
              key={w.word_number}
              className={`bg-red-50 p-4 rounded-xl border border-red-200 transition-all duration-300 ease-out hover:shadow-sm ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-lg font-medium flex-shrink-0">
                  No.{w.word_number}
                </span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800 mb-1">{w.word}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{w.meaning}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedStats, setGroupedStats] = useState<TextbookStats[]>([]);

  useEffect(() => {
    let mounted = true;

    // タイムアウトセーフティ: 5秒でローディング強制解除
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('History page loading timeout');
        setLoading(false);
        setError('データの読み込みがタイムアウトしました。再読み込みしてください。');
      }
    }, 5000);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // fetch results for current user
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Auth error:', authError);
          setError('認証エラー: ' + authError.message);
          return;
        }
        const userId = userData?.user?.id ?? null;
        if (!userId) {
          setResults([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          const resultsData = data ?? [];
          setResults(resultsData);

          // 単語帳ごとに統計を計算
          const statsMap = new Map<string, TestResult[]>();

          resultsData.forEach(result => {
            const textName = result.selected_text ?? '小テスト';
            if (!statsMap.has(textName)) {
              statsMap.set(textName, []);
            }
            statsMap.get(textName)!.push(result);
          });

          const stats: TextbookStats[] = Array.from(statsMap.entries()).map(([textName, textResults]) => {
            const totalTests = textResults.length;
            const totalQuestions = textResults.reduce((sum, r) => sum + r.total, 0);
            const totalCorrect = textResults.reduce((sum, r) => sum + r.correct, 0);
            const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

            return {
              textName,
              totalTests,
              totalQuestions,
              totalCorrect,
              averageScore,
              recentResults: textResults.slice(0, 3) // 最新3件
            };
          });

          // 最近のテスト順で並び替え（最新のテストがある単語帳を上に）
          stats.sort((a, b) => {
            const aLatestDate = new Date(a.recentResults[0]?.created_at || 0);
            const bLatestDate = new Date(b.recentResults[0]?.created_at || 0);
            return bLatestDate.getTime() - aLatestDate.getTime();
          });
          setGroupedStats(stats);
        }
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
        clearTimeout(safetyTimeout);
      }
    }

    load();
    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Background className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8" style={{ marginTop: '25px' }}>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                学習履歴
              </h1>
              <p className="text-gray-600 text-lg">
                これまでの頑張りを振り返りましょう
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="self-start md:self-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              戻る
            </button>
          </div>

          {/* 広告エリア */}
          <div className="w-full mb-8">
            <GoogleAdsense
              slot="9969163744"
              format="auto"
              responsive="true"
              style={{ display: 'block' }}
            />
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8">
              {error}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl text-center px-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">まだ履歴がありません</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                テストを受けると、ここにあなたの学習記録が蓄積されていきます。<br />
                まずは最初のテストに挑戦してみましょう！
              </p>
              <button
                onClick={() => router.push('/mistap/test-setup')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                最初のテストを作成
              </button>
            </div>
          )}

          {/* 単語帳ごとの統計表示 */}
          {!loading && groupedStats.length > 0 && (
            <div className="space-y-8">
              {groupedStats.map((stats) => (
                <div key={stats.textName} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* 単語帳のヘッダー */}
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{stats.textName}</h2>
                      </div>
                      <button
                        onClick={() => router.push(`/mistap/textbook-analysis?name=${encodeURIComponent(stats.textName)}`)}
                        className="group flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
                      >
                        詳細分析を見る
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1 font-medium">平均正答率</div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.averageScore}<span className="text-sm ml-1">%</span></div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1 font-medium">テスト回数</div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalTests}<span className="text-sm ml-1">回</span></div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1 font-medium">総問題数</div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalQuestions}<span className="text-sm ml-1">問</span></div>
                      </div>
                    </div>
                  </div>

                  {/* 最近のテスト履歴 */}
                  <div className="p-6 md:p-8 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                      最近のテスト結果
                    </h3>
                    <div className="space-y-4">
                      {stats.recentResults.map((result) => {
                        const scorePercentage = Math.round((result.correct / result.total) * 100);
                        const isHighScore = scorePercentage >= 80;

                        return (
                          <div key={result.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${isHighScore ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                  }`}>
                                  {scorePercentage}<span className="text-xs ml-0.5">%</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(result.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </div>
                                  <div className="font-medium text-gray-900">
                                    {result.unit ? (
                                      <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                                        {result.unit}
                                      </span>
                                    ) : (result.start_num && result.end_num ? (
                                      <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                                        No. {result.start_num} - {result.end_num}
                                      </span>
                                    ) : (
                                      <span className="text-gray-600">全範囲</span>
                                    ))}
                                    <span className="mx-2 text-gray-300">|</span>
                                    <span className="text-gray-600 text-sm">{result.correct}/{result.total}問正解</span>
                                    {result.mode && (
                                      <>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${result.mode === 'meaning-word' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                          {result.mode === 'meaning-word' ? '意味→単語' : '単語→意味'}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {result.incorrect_words && result.incorrect_words.length > 0 && (
                              <IncorrectWordsSection
                                words={result.incorrect_words}
                                count={result.incorrect_count}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Background>
      <MistapFooter />
    </main>
  );
}