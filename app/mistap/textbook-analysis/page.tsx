'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/mistap/supabaseClient';
import Background from '@/components/mistap/Background';

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
}

interface WordFrequency {
  word: string;
  meaning: string;
  word_number: number;
  frequency: number;
  lastMistaken: string;
}

interface IncorrectWordsSectionProps {
  words: IncorrectWord[];
  count: number;
}

function IncorrectWordsSection({ words, count }: IncorrectWordsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
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

function TextbookAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [textbookName, setTextbookName] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frequentMistakes, setFrequentMistakes] = useState<WordFrequency[]>([]);

  useEffect(() => {
    const name = searchParams.get('name');
    if (!name) {
      router.push('/mistap/history');
      return;
    }
    setTextbookName(name);

    async function loadAnalysis() {
      try {
        const { data: userData } = await supabase.auth.getUser();
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
          .eq('selected_text', name)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          const resultsData = data ?? [];
          setResults(resultsData);

          // 間違いやすい単語を分析
          const mistakeMap = new Map<number, WordFrequency>();

          resultsData.forEach(result => {
            if (result.incorrect_words) {
              result.incorrect_words.forEach((word: IncorrectWord) => {
                const existing = mistakeMap.get(word.word_number);
                if (existing) {
                  existing.frequency++;
                  existing.lastMistaken = result.created_at;
                } else {
                  mistakeMap.set(word.word_number, {
                    word: word.word,
                    meaning: word.meaning,
                    word_number: word.word_number,
                    frequency: 1,
                    lastMistaken: result.created_at
                  });
                }
              });
            }
          });

          // 頻度順にソート
          const sortedMistakes = Array.from(mistakeMap.values())
            .sort((a, b) => b.frequency - a.frequency);

          setFrequentMistakes(sortedMistakes);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Background className="min-h-screen">
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </Background>
      </main>
    );
  }

  const totalTests = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <Background className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8" style={{ marginTop: '25px' }}>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                {textbookName}
              </h1>
              <p className="text-gray-600 text-lg">
                詳細分析レポート
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8">
              {error}
            </div>
          )}

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl text-center px-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">データがありません</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                この単語帳のテスト履歴が見つかりませんでした。
              </p>
              <button
                onClick={() => router.push('/mistap/test-setup')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                テストを作成
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 総合統計 */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                  総合成績
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1 font-medium">平均正答率</div>
                    <div className="text-2xl font-bold text-gray-900">{averageScore}<span className="text-sm ml-1">%</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1 font-medium">テスト回数</div>
                    <div className="text-2xl font-bold text-gray-900">{totalTests}<span className="text-sm ml-1">回</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1 font-medium">総問題数</div>
                    <div className="text-2xl font-bold text-gray-900">{totalQuestions}<span className="text-sm ml-1">問</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="text-sm text-gray-500 mb-1 font-medium">苦手な単語</div>
                    <div className="text-2xl font-bold text-red-600">{frequentMistakes.length}<span className="text-sm ml-1 text-gray-500">語</span></div>
                  </div>
                </div>
              </div>

              {/* よく間違える単語 */}
              {frequentMistakes.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                    よく間違える単語 TOP 10
                  </h2>
                  <div className="space-y-3">
                    {frequentMistakes.slice(0, 10).map((mistake) => (
                      <div key={mistake.word_number} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200 hover:border-red-200 transition-colors">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-bold text-red-600 bg-white px-2 py-1 rounded-lg border border-red-100 min-w-[3.5rem] text-center">
                            No.{mistake.word_number}
                          </span>
                          <div>
                            <div className="font-bold text-lg text-gray-900">{mistake.word}</div>
                            <div className="text-sm text-gray-600">{mistake.meaning}</div>
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-lg font-bold text-red-600">{mistake.frequency}回</div>
                          <div className="text-xs text-gray-500">
                            最終: {new Date(mistake.lastMistaken).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 全テスト履歴 */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                  テスト履歴
                </h2>
                <div className="space-y-4">
                  {results.map((result) => {
                    const scorePercentage = Math.round((result.correct / result.total) * 100);
                    const isHighScore = scorePercentage >= 80;

                    return (
                      <div key={result.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${isHighScore ? 'bg-white text-red-600 border border-red-100' : 'bg-white text-gray-600 border border-gray-200'
                              }`}>
                              {scorePercentage}<span className="text-xs ml-0.5">%</span>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">
                                {new Date(result.created_at).toLocaleString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {result.start_num && result.end_num ? (
                                <span className="text-sm font-medium text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                                  No. {result.start_num} - {result.end_num}
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-gray-500">全範囲</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {result.correct}<span className="text-sm text-gray-400 mx-1">/</span>{result.total}
                            </div>
                            <div className="text-xs text-gray-500">正解</div>
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
          )}
        </div>
      </Background>
    </main>
  );
}

export default function TextbookAnalysisPage() {
  return (
    <Suspense fallback={
      <Background>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">読み込み中...</div>
        </div>
      </Background>
    }>
      <TextbookAnalysisContent />
    </Suspense>
  );
}