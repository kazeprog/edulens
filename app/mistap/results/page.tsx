'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";
import GoogleAdsense from "@/components/GoogleAdsense";
import { normalizeTextbookName } from "@/lib/mistap/textbookUtils";

interface TappedWord {
  word_number: number;
  word: string;
  meaning: string;
}

interface ResultData {
  tappedWords: TappedWord[];
  correctWords: TappedWord[];
  total: number;
  selectedText: string;
  startNum: number;
  endNum: number;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // document.title removed for server-side metadata

    // 新しい形式: URLパラメータから読み込み（単語番号のみ）
    const textParam = searchParams.get('text');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    const totalParam = searchParams.get('total');
    const wrongParam = searchParams.get('wrong');
    const correctParam = searchParams.get('correct');

    if (textParam && totalParam !== null) {
      // URLパラメータから結果データを復元
      const loadResultData = async () => {
        try {
          const selectedText = decodeURIComponent(textParam);
          const startNum = startParam ? parseInt(startParam) : 0;
          const endNum = endParam ? parseInt(endParam) : 0;
          const total = parseInt(totalParam);
          const wrongNumbers = wrongParam ? wrongParam.split(',').map(n => parseInt(n)).filter(n => !isNaN(n)) : [];
          const correctNumbers = correctParam ? correctParam.split(',').map(n => parseInt(n)).filter(n => !isNaN(n)) : [];

          // "(復習テスト)" などのサフィックスを除去して検索
          const normalizedTextName = selectedText.replace(/[\s]*[（(][^）)]*復習[^)）]*[)）][\s]*$/u, '').trim();

          // 間違えた単語の詳細を単語番号から取得
          let tappedWords: TappedWord[] = [];
          if (wrongNumbers.length > 0) {
            const { data, error } = await supabase
              .from("words")
              .select("word, word_number, meaning")
              .eq("text", normalizedTextName)
              .in("word_number", wrongNumbers);

            if (!error && data) {
              tappedWords = data;
            }
          }

          // 正解した単語の詳細を単語番号から取得
          let correctWords: TappedWord[] = [];
          if (correctNumbers.length > 0) {
            const { data, error } = await supabase
              .from("words")
              .select("word, word_number, meaning")
              .eq("text", normalizedTextName)
              .in("word_number", correctNumbers);

            if (!error && data) {
              correctWords = data;
            }
          }

          setResultData({
            tappedWords,
            correctWords,
            total,
            selectedText,
            startNum,
            endNum
          });
        } catch {
          router.push('/mistap/test-setup');
        }
      };

      loadResultData();
      return;
    }

    // フォールバック: 旧形式のdataパラメータをチェック
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setResultData(parsedData);
      } catch {
        router.push('/mistap/test-setup');
      }
    } else {
      router.push('/mistap/test-setup');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!resultData) return;

    let didSave = false;
    async function saveResult() {
      if (didSave) return;
      didSave = true;
      setSaving(true);
      setError(null);

      const { tappedWords = [], correctWords = [], total = 0, selectedText, startNum, endNum } = resultData || {};
      const correct = total - tappedWords.length;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const userId = user?.id ?? null;

        // 未ログインユーザーの場合は保存を試行せずに適切なメッセージを表示
        if (!userId) {
          setIsLoggedIn(false);
          setError("アカウント登録後はあなたの成績が\n記録されていきます！\n一緒に勉強を始めましょう！");
          setSaving(false);
          return;
        }

        setIsLoggedIn(true);

        // create a deterministic test key so duplicates can be avoided server-side
        // URLパラメータのタイムスタンプを含めることで、同じテストでも複数回記録されるようにし、
        // かつページリロード時の重複登録は防ぐ
        const attemptId = searchParams.get('t') || '';
        const wordNumbers = Array.isArray(tappedWords) ? tappedWords.map((w: TappedWord) => w.word_number).sort((a: number, b: number) => a - b) : [];
        const testKey = `${selectedText ?? ''}::${startNum ?? ''}::${endNum ?? ''}::${wordNumbers.join(',')}::${attemptId}`;

        // 教科書名を正規化（例: "New Crown 中1 - Lesson1" -> "New Crown 中1"）
        const normalizedTextbookName = selectedText ? normalizeTextbookName(selectedText) : null;

        // 単元名を抽出（正規化された教科書名を除いた部分）
        // 例: "New Crown 中1 - Lesson1 - Part1" -> "Lesson1 Part1"
        // 例: "New Crown 中1 (復習テスト)" -> "復習テスト"
        let unitName = null;
        if (selectedText && normalizedTextbookName && selectedText.length > normalizedTextbookName.length) {
          // 正規化名以降の部分を取得し、先頭の区切り文字（ハイフン等）を除去
          let suffix = selectedText.substring(normalizedTextbookName.length).replace(/^[\s-–—]+/, '').trim();

          // 復習テストの括弧を除去
          if (suffix.includes('復習テスト')) {
            suffix = suffix.replace(/[（(]復習テスト[)）]/, '復習テスト').trim();
          }

          // 学習状況カテゴリの括弧を除去
          suffix = suffix.replace(/[（(](覚えた|要チェック|覚えていない)[^)）]*[)）]/g, '$1単語').trim();

          // 内部のハイフンをスペースに置換して見やすくする
          if (suffix) {
            unitName = suffix.replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }

        const payload = {
          user_id: userId,
          selected_text: normalizedTextbookName,
          unit: unitName, // 新しいunitカラムに保存
          start_num: startNum ?? null,
          end_num: endNum ?? null,
          total: total ?? 0,
          correct: correct ?? 0,
          incorrect_count: tappedWords.length ?? 0,
          incorrect_words: tappedWords ?? [],
          correct_words: correctWords ?? [],
          test_key: testKey,
        };

        // try upsert by unique index (user_id, test_key) to avoid duplicates
        const { error: insertError } = await supabase
          .from("results")
          // PostgREST expects column names for onConflict (comma separated), not the index name
          .upsert([payload], { onConflict: 'user_id,test_key' })
          .select();

        if (insertError) {
          // Row-level security policyエラーの場合は未ログインユーザー向けのメッセージに
          if (insertError.message?.includes('row-level security policy') || insertError.message?.includes('violates')) {
            setError("登録後はあなたの成績が記録されていきます！");
          } else {
            setError(insertError.message || "保存に失敗しました");
          }
        } else {
          setSaved(true);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setSaving(false);
      }
    }

    // save once on mount
    saveResult();
  }, [resultData]);

  if (!resultData) {
    return (
      <main className="min-h-screen">
        <Background className="flex justify-center items-start min-h-screen">
          <div className="text-white text-xl" style={{ marginTop: 'calc(64px + 48px)' }}>Loading...</div>
        </Background>
      </main>
    );
  }

  const { tappedWords = [], total = 0 } = resultData;

  // 表示用に教科書名と範囲（単元名）を分割
  let displayTextbook = resultData.selectedText ?? '小テスト';
  let unitLabel: string | null = null;
  // const isReview = displayTextbook.includes('(復習テスト)'); // Check deprecated

  if (resultData.selectedText) {
    const normalized = normalizeTextbookName(resultData.selectedText);
    // 教科書名が正規化名で始まっていて、かつ後ろに何か続いている場合のみ分割
    if (resultData.selectedText.startsWith(normalized) && resultData.selectedText.length > normalized.length) {
      let suffix = resultData.selectedText.substring(normalized.length).replace(/^[\s-–—]+/, '').trim();

      // 復習テストの括弧を除去してきれいにする
      if (suffix.includes('復習テスト')) {
        suffix = suffix.replace(/[（(]復習テスト[)）]/, '復習テスト').trim();
      }

      if (suffix) {
        displayTextbook = normalized;
        // 範囲表示用に整形（ハイフンをスペースに）
        unitLabel = suffix.replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }
  }

  const displayRange = unitLabel
    ? unitLabel
    : ((resultData.startNum && resultData.endNum)
      ? `${resultData.startNum}〜${resultData.endNum}`
      : '全範囲');
  // (correct already computed above in saveResult scope) — compute for display
  const correct = total - tappedWords.length;

  // X (Twitter) 共有用ハンドラ
  const shareToX = () => {
    try {
      const scorePercent = isFinite((correct / total) * 100) ? Math.round((correct / total) * 100) : 0;
      const template = `Mistapで単語テストを実施しました！\n教材: ${displayTextbook}\n範囲: ${displayRange}\n正答率: ${scorePercent}% (${correct}/${total})\n\n使用した単語テストアプリ:Mistap https://edulens.jp/mistap`;
      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(template)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // 共有に失敗
    }
  };

  // OS標準の共有（Web Share API）を使って結果を共有する
  const shareResults = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://edulens.jp';
      const countForShare = total && total > 0 ? total : 10;
      const demoUrl = `${origin}/mistap/test-setup?demo=1&selectedText=${encodeURIComponent(displayTextbook)}&startNum=${encodeURIComponent(String(resultData.startNum ?? ''))}&endNum=${encodeURIComponent(String(resultData.endNum ?? ''))}&count=${encodeURIComponent(String(countForShare))}`;
      // 共有時は点数や正答率は含めず、教材と範囲＋デモURLのみを共有する
      const template = `Mistapで単語テストを作りました！\n教材: ${displayTextbook}\n範囲: ${displayRange}\n\nこのテストを友達とシェア → ${demoUrl}`;

      if (typeof navigator !== 'undefined') {
        const nav = navigator as unknown as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (typeof nav.share === 'function') {
          await nav.share({ title: 'Mistap — テスト結果', text: template, url: demoUrl });
          setShareMessage('共有ダイアログを開きました');
        } else {
          // Open a small share modal offering copy / Twitter / email options on desktop
          setShowShareModal(true);
        }
      } else {
        setShareMessage('この環境では共有に対応していません');
      }
    } catch {
      setShareMessage('共有に失敗しました');
    } finally {
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  return (
    <main className="min-h-screen">
      <Background className="flex items-start justify-center min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-xl w-full max-w-3xl border border-white/50" style={{ marginTop: '25px' }}>
          <h1 className="text-3xl font-bold mb-6 text-center">テスト結果</h1>

          {/* 実施した教材・範囲 */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600">教材: <span className="font-semibold text-gray-800">{displayTextbook}</span></div>
            {displayRange && (
              <div className="text-sm text-gray-600">範囲: <span className="font-semibold text-gray-800">{displayRange}</span></div>
            )}
          </div>

          {/* 正答率の大きな表示 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">{Math.round((correct / total) * 100)}%</span>
            </div>
            <p className="text-lg font-semibold text-gray-700">正答率</p>
          </div>

          {/* 詳細スコア */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-red-200">
              <div className="text-2xl font-bold text-gray-600">{total}</div>
              <div className="text-sm text-gray-600">総問題数</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-300">
              <div className="text-2xl font-bold text-red-600">{correct}</div>
              <div className="text-sm text-gray-600">正答数</div>
            </div>
            <div className="bg-red-100 rounded-xl p-4 text-center border-2 border-red-400">
              <div className="text-2xl font-bold text-red-700">{tappedWords.length}</div>
              <div className="text-sm text-gray-600">誤答数</div>
            </div>
          </div>


          {/* 広告エリア（間違えた単語の上） */}
          <div className="flex justify-center items-center mb-6 w-full text-center">
            <GoogleAdsense
              slot="9969163744"
              format="rectangle"
              style={{ display: 'block', margin: '0 auto', maxWidth: '336px', height: '280px' }}
              responsive="false"
            />
          </div>

          <h2 className="font-semibold mb-2">間違えた単語</h2>
          <div className="space-y-3 mb-6">
            {Array.isArray(tappedWords) && tappedWords.length > 0 ? (
              tappedWords.map((w: TappedWord) => (
                <div key={w.word_number} className="border rounded-xl p-3 bg-white/50">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-lg">{w.word}</span>
                    <span className="text-sm text-gray-500">({w.word_number})</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {w.meaning}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">ありません</div>
            )}
          </div>

          {/* 広告エリア（間違えた単語の下） */}
          <div className="flex justify-center items-center my-6 w-full text-center">
            <GoogleAdsense
              slot="9969163744"
              format="rectangle"
              style={{ display: 'block', margin: '0 auto', maxWidth: '336px', height: '280px' }}
              responsive="false"
            />
          </div>

          <div className="space-y-4">
            <div className="text-center">
              {saving && <span className="text-sm text-gray-500">保存中…</span>}
              {saved && <span className="text-sm text-green-600">保存しました</span>}
              {error && (
                <span className={`text-sm whitespace-pre-line ${error.includes('アカウント登録後は') ? 'text-blue-600' : 'text-red-600'}`}>
                  {error}
                </span>
              )}
              {shareMessage && (
                <div className="mt-2">
                  <span className="text-sm text-gray-700">{shareMessage}</span>
                </div>
              )}
              {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowShareModal(false)} />
                  <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-[90%] max-w-md">
                    <h3 className="text-lg font-semibold mb-3">共有オプション</h3>
                    <p className="text-sm text-gray-600 mb-4">このブラウザはネイティブ共有に対応していません。以下から選んで共有してください。</p>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs text-gray-500">共有用リンク</label>
                        <div className="mt-1 flex gap-2">
                          <input
                            id="demo-share-url"
                            readOnly
                            value={typeof window !== 'undefined' ? `${window.location.origin}/mistap/test-setup?demo=1&selectedText=${encodeURIComponent(displayTextbook)}&startNum=${encodeURIComponent(String(resultData.startNum ?? ''))}&endNum=${encodeURIComponent(String(resultData.endNum ?? ''))}&count=${encodeURIComponent(String(total && total > 0 ? total : 10))}` : ''}
                            className="flex-1 rounded border px-3 py-2 text-sm bg-gray-50"
                            onFocus={(e) => { (e.target as HTMLInputElement).select(); }}
                          />
                          <button
                            onClick={async () => {
                              const el = document.getElementById('demo-share-url') as HTMLInputElement | null;
                              const demoUrl = el?.value ?? '';
                              let copied = false;
                              try {
                                if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                                  await navigator.clipboard.writeText(demoUrl);
                                  copied = true;
                                }
                              } catch (err) {
                                copied = false;
                              }
                              if (!copied && typeof document !== 'undefined') {
                                try {
                                  if (el) {
                                    el.select();
                                    const ok = document.execCommand('copy');
                                    copied = !!ok;
                                  }
                                } catch (err) {
                                  copied = false;
                                }
                              }
                              setShareMessage(copied ? 'リンクをクリップボードにコピーしました' : 'コピーに失敗しました。リンクを手動で選択してください');
                              setShowShareModal(false);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm"
                          >
                            コピー
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">リンクを長押しまたはコピーして友達に貼り付けてください。</p>
                      </div>
                      <button
                        onClick={() => {
                          const origin = 'https://edulens.jp';
                          const demoUrl = `${origin}/mistap/test-setup?demo=1&selectedText=${encodeURIComponent(displayTextbook)}&startNum=${encodeURIComponent(String(resultData.startNum ?? ''))}&endNum=${encodeURIComponent(String(resultData.endNum ?? ''))}&count=${encodeURIComponent(String(total && total > 0 ? total : 10))}`;
                          // モーダル経由の共有でも点数は含めない
                          const text = `Mistapで単語テストを作りました！\n教材: ${displayTextbook}\n範囲: ${displayRange}\n\n${demoUrl}`;
                          const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                          setShowShareModal(false);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Twitterで共有
                      </button>
                      <a
                        href={`mailto:?subject=${encodeURIComponent('Mistapのテスト共有')}&body=${encodeURIComponent(`教材: ${displayTextbook}\n範囲: ${displayRange}\n\n${typeof window !== 'undefined' ? window.location.origin : 'https://edulens.jp'}/mistap/test-setup?demo=1&selectedText=${encodeURIComponent(displayTextbook)}&startNum=${encodeURIComponent(String(resultData.startNum ?? ''))}&endNum=${encodeURIComponent(String(resultData.endNum ?? ''))}`)}`}
                        className="w-full inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
                      >
                        メールで送る
                      </a>
                      <button onClick={() => setShowShareModal(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded">閉じる</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* スマホ用: 縦並びボタン */}
            <div className="block md:hidden space-y-3">
              {!isLoggedIn && (
                <button
                  onClick={() => router.push('/login?mode=signup&redirect=/mistap/home')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-lg font-semibold"
                >
                  アカウント登録
                </button>
              )}
              <button
                onClick={() => router.push('/mistap/test-setup')}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-xl text-lg"
              >
                新しいテスト
              </button>
              <button
                onClick={() => router.push('/mistap/home')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl text-lg"
              >
                ホーム画面に戻る
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => router.push('/mistap/history')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-lg font-semibold"
                >
                  成績管理
                </button>
              )}
              <button
                onClick={shareResults}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-lg font-medium"
              >
                実施したテストを共有
              </button>
              <button
                onClick={shareToX}
                aria-label="結果をXにポスト"
                className="w-full bg-black hover:bg-zinc-800 text-white py-3 px-4 rounded-xl text-lg font-medium"
              >
                結果をXにポスト
              </button>
            </div>

            {/* タブレット・PC用: 横並びボタン */}
            <div className="hidden md:flex md:justify-center md:space-x-4">
              {!isLoggedIn && (
                <button
                  onClick={() => router.push('/login?mode=signup&redirect=/mistap/home')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
                >
                  アカウント登録
                </button>
              )}
              <button
                onClick={() => router.push('/mistap/test-setup')}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl"
              >
                新しいテスト
              </button>
              <button
                onClick={() => router.push('/mistap/home')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl"
              >
                ホーム画面に戻る
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => router.push('/mistap/history')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
                >
                  成績管理
                </button>
              )}
              <button
                onClick={shareResults}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
              >
                実施したテストを共有
              </button>
              <button
                onClick={shareToX}
                aria-label="結果をXにポスト"
                className="bg-black hover:bg-zinc-800 text-white px-6 py-2 rounded-xl"
              >
                結果をXにポスト
              </button>
            </div>
          </div>
        </div>
      </Background>
      <MistapFooter />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Background className="flex justify-center items-start min-h-screen">
          <div className="text-white text-xl" style={{ marginTop: '25px' }}>Loading...</div>
        </Background>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}