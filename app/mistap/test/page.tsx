'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import FlippableCard from "@/components/mistap/FlippableCard";

interface Word {
  word_number: number;
  word: string;
  meaning: string;
  requiredMinHeight?: number; // カードごとの最適な高さ
}

interface TestData {
  words: Word[];
  selectedText: string;
  startNum: number;
  endNum: number;
}

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [tappedIds, setTappedIds] = useState<Set<number>>(new Set());
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [showPrintWarning, setShowPrintWarning] = useState<boolean>(false);
  const desktopGridRef = useRef<HTMLDivElement | null>(null);
  const mobileCardsRef = useRef<HTMLDivElement | null>(null);
  const [wordsWithHeights, setWordsWithHeights] = useState<Word[]>([]);

  function handleCancel() {
    router.push('/mistap/test-setup');
  }

  // Calculate individual card heights for mobile flip cards
  useEffect(() => {
    if (!testData || !mobileCardsRef.current) return;

    const calculateCardHeights = () => {
      // Create temporary invisible container to measure content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.width = `${mobileCardsRef.current?.offsetWidth || 300}px`;
      document.body.appendChild(tempContainer);

      const wordsWithCalculatedHeights = testData.words.map(word => {
        // Measure front side (word only)
        const frontCard = document.createElement('div');
        frontCard.style.cssText = 'padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; border: 2px solid; border-radius: 0.75rem;';
        frontCard.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0;">
            <span style="min-width: 2rem; font-size: 1rem; flex-shrink: 0;">${word.word_number}</span>
            <span style="font-size: 1.125rem; font-weight: 600; flex: 1; word-wrap: break-word; overflow-wrap: break-word;">${word.word}</span>
          </div>
        `;
        tempContainer.appendChild(frontCard);
        const frontHeight = frontCard.getBoundingClientRect().height;
        tempContainer.removeChild(frontCard);

        // Measure back side (word + meaning)
        const backCard = document.createElement('div');
        backCard.style.cssText = 'padding: 0.75rem 1rem; display: flex; flex-direction: column; border: 2px solid; border-radius: 0.75rem;';
        backCard.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 0;">
            <span style="min-width: 2rem; font-size: 0.875rem; margin-top: 0.25rem; flex-shrink: 0;">${word.word_number}</span>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem; word-wrap: break-word; overflow-wrap: break-word;">${word.word}</div>
              <div style="font-size: 0.875rem; line-height: 1.25rem; word-wrap: break-word; overflow-wrap: break-word;">${word.meaning}</div>
            </div>
          </div>
          <div style="font-size: 0.75rem; text-align: right; margin-top: auto;">スワイプで戻る</div>
        `;
        tempContainer.appendChild(backCard);
        const backHeight = backCard.getBoundingClientRect().height;
        tempContainer.removeChild(backCard);

        // Use the larger of the two heights, plus safety margin
        const requiredMinHeight = Math.ceil(Math.max(frontHeight, backHeight) + 8);

        return {
          ...word,
          requiredMinHeight
        };
      });

      document.body.removeChild(tempContainer);
      setWordsWithHeights(wordsWithCalculatedHeights);
    };

    // Wait for DOM to be ready
    const timer = setTimeout(calculateCardHeights, 100);
    return () => clearTimeout(timer);
  }, [testData]);

  // Adjust all card heights to match the tallest card on desktop (md and up).
  // Measure with answers visible to ensure cards are tall enough.
  useEffect(() => {
    const adjustHeights = () => {
      if (!desktopGridRef.current) return;
      // only apply on md and above
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        // remove inline heights on mobile
        Array.from(desktopGridRef.current.querySelectorAll<HTMLElement>('.test-card')).forEach((el: HTMLElement) => {
          el.style.height = '';
        });
        return;
      }

      const cards = Array.from(desktopGridRef.current.querySelectorAll<HTMLElement>('.test-card')) as HTMLElement[];
      if (cards.length === 0) return;

      // Reset heights first
      cards.forEach((el: HTMLElement) => {
        el.style.height = 'auto';
      });

      // Force all answers to be visible temporarily to measure max height needed
      const answerElements = cards.map(card => {
        const answerEl = card.querySelector('.answer-content') as HTMLElement | null;
        const prevOpacity = answerEl?.style.opacity || '';
        if (answerEl) {
          answerEl.style.opacity = '1';
        }
        return { answerEl, prevOpacity };
      });

      // Force layout recalculation
      void cards[0]?.offsetHeight;

      // Measure maximum height
      let max = 0;
      cards.forEach((el: HTMLElement) => {
        const h = el.getBoundingClientRect().height;
        if (h > max) max = h;
      });

      // Restore answer opacity
      answerElements.forEach(({ answerEl, prevOpacity }) => {
        if (answerEl) {
          answerEl.style.opacity = prevOpacity;
        }
      });

      // Apply the maximum height to all cards
      if (max > 0) {
        cards.forEach((el: HTMLElement) => {
          el.style.height = `${Math.ceil(max)}px`;
        });
      }
    };

    if (!testData) return;

    // wait a tick so DOM finishes rendering
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        adjustHeights();
      });
    }, 100);

    const grid = desktopGridRef.current;
    return () => {
      clearTimeout(t);
      // on unmount, clear heights
      if (grid) {
        Array.from(grid.querySelectorAll<HTMLElement>('.test-card')).forEach((el: HTMLElement) => el.style.height = '');
      }
    };
  }, [testData]);

  useEffect(() => {
    document.title = '英単語テスト - Mistap';

    // 新しい形式: 範囲パラメータから新しいテストを生成（共有URL対応）
    const textParam = searchParams.get('text');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    const countParam = searchParams.get('count');

    if (textParam && startParam && endParam && countParam) {
      // URLから範囲を取得して、新しいテストを生成
      const generateTest = async () => {
        try {
          const selectedText = decodeURIComponent(textParam);
          const startNum = parseInt(startParam);
          const endNum = parseInt(endParam);
          const count = parseInt(countParam);

          const { data, error } = await supabase
            .from("words")
            .select("word, word_number, meaning")
            .eq("text", selectedText)
            .gte("word_number", startNum)
            .lte("word_number", endNum);

          if (error || !data || data.length === 0) {
            console.error('データ取得エラー:', error);
            router.push('/mistap/test-setup');
            return;
          }

          // ランダムに抽出
          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);

          setTestData({
            selectedText,
            words: shuffled,
            startNum,
            endNum
          });
        } catch (error) {
          console.error('テスト生成エラー:', error);
          router.push('/mistap/test-setup');
        }
      };

      generateTest();
      return;
    }

    // フォールバック: 旧形式のdataパラメータをチェック
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        let decodedData: string;
        try {
          decodedData = decodeURIComponent(dataParam);
        } catch (decodeError) {
          console.warn('decodeURIComponent failed, using raw data:', decodeError);
          decodedData = dataParam;
        }
        const parsedData = JSON.parse(decodedData);
        setTestData(parsedData);
      } catch (error) {
        console.error('Failed to parse test data:', error);
        router.push('/mistap/test-setup');
      }
    } else {
      router.push('/mistap/test-setup');
    }
  }, [searchParams, router]);

  function toggleTapped(id: number) {
    setTappedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFlipped(id: number) {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handlePrint() {
    if (!testData) return;
    const { words } = testData;

    // 20語を超える場合は警告を表示
    if (words.length > 20) {
      setShowPrintWarning(true);
      return;
    }

    // 20語以下の場合は通常の印刷処理
    executePrint();
  }

  function executePrint() {
    if (!testData) return;
    const { words, selectedText, startNum, endNum } = testData;

    // タイトル生成
    const title = (selectedText === "過去形" || selectedText === "過去形、過去分詞形")
      ? `${selectedText} 小テスト`
      : (startNum != null && endNum != null)
        ? `${selectedText}(${startNum}〜${endNum}) 小テスト`
        : `${selectedText} 小テスト`;

    // 左右の列に分ける
    const leftWords = words.filter((_: Word, i: number) => i % 2 === 0);
    const rightWords = words.filter((_: Word, i: number) => i % 2 === 1);

    // 新しいウィンドウで印刷用HTMLを生成
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @media print {
      @page {
        margin: 15mm 20mm;
        size: A4;
      }
      .page-break {
        page-break-after: always;
      }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Yu Gothic', 'Hiragino Sans', sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 0;
    }
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    h1 {
      text-align: center;
      font-size: 22px;
      margin-bottom: 16px;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
      flex-shrink: 0;
    }
    .two-column-container {
      display: flex;
      gap: 20px;
      flex: 1;
      align-items: stretch;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .word-item {
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #fafafa;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .word-number {
      font-weight: bold;
      font-size: 15px;
      margin-bottom: 4px;
    }
    .meaning {
      color: #555;
      font-size: 13px;
      line-height: 1.5;
    }
    .answer-section .meaning {
      display: block;
    }
    .problem-section .meaning {
      display: none;
    }
  </style>
</head>
<body>
  <!-- 問題ページ -->
  <div class="page problem-section">
    <h1>${title}</h1>
    <div class="two-column-container">
      <div class="column">
        ${leftWords.map(w => `
          <div class="word-item">
            <div class="word-number">• ${w.word}（${w.word_number}）</div>
            <div class="meaning">${w.meaning}</div>
          </div>
        `).join('')}
      </div>
      <div class="column">
        ${rightWords.map(w => `
          <div class="word-item">
            <div class="word-number">• ${w.word}（${w.word_number}）</div>
            <div class="meaning">${w.meaning}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- 改ページ -->
  <div class="page-break"></div>

  <!-- 解答ページ -->
  <div class="page answer-section">
    <h1>${title} - 解答</h1>
    <div class="two-column-container">
      <div class="column">
        ${leftWords.map(w => `
          <div class="word-item">
            <div class="word-number">• ${w.word}（${w.word_number}）</div>
            <div class="meaning">${w.meaning}</div>
          </div>
        `).join('')}
      </div>
      <div class="column">
        ${rightWords.map(w => `
          <div class="word-item">
            <div class="word-number">• ${w.word}（${w.word_number}）</div>
            <div class="meaning">${w.meaning}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // 印刷ダイアログを開く
    printWindow.onload = () => {
      printWindow.print();
      // 印刷後にウィンドウを閉じる（ユーザーがキャンセルした場合も考慮）
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  function recreateWith20Words() {
    if (!testData) return;
    const { selectedText, startNum } = testData;

    // 最初の20語の範囲を計算
    const newEndNum = startNum != null ? startNum + 19 : 20;

    // 範囲パラメータで遷移（新しい20語がランダムに出題される）
    router.push(`/mistap/test?text=${encodeURIComponent(selectedText)}&start=${startNum || 1}&end=${newEndNum}&count=20`);
    setShowPrintWarning(false);
  }



  if (!testData) {
    return (
      <div className="min-h-screen">
        <Background className="flex justify-center items-start min-h-screen">
          <div className="text-white text-xl" style={{ marginTop: 'calc(64px + 48px)' }}>Loading...</div>
        </Background>
      </div>
    );
  }

  const { words, selectedText, startNum, endNum } = testData;
  const leftWords = Array.isArray(words) ? words.filter((_, i) => i % 2 === 0) : [];
  const rightWords = Array.isArray(words) ? words.filter((_, i) => i % 2 === 1) : [];



  return (
    <div className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full md:max-w-6xl border border-white/50" style={{ marginTop: '25px' }}>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6" translate="no">
            {selectedText ? (
              // 「過去形」「過去形、過去分詞形」の場合は範囲を表示しない
              (selectedText === "過去形" || selectedText === "過去形、過去分詞形") ?
                `${selectedText} 小テスト` :
                (startNum != null && endNum != null) ?
                  `${selectedText}(${startNum}〜${endNum}) 小テスト` :
                  `${selectedText} 小テスト`
            ) : "小テスト"}
          </h1>
          {/* スマホでは1列、タブレット以上では2列レイアウト */}
          <div className="mb-8" translate="no">
            {/* スマホ用: 1列レイアウト - フリップカード */}
            <div
              ref={mobileCardsRef}
              className="block md:hidden"
            >
              {(wordsWithHeights.length > 0 ? wordsWithHeights : words).map((item: Word) => (
                <FlippableCard
                  key={item.word_number}
                  word={item.word}
                  meaning={item.meaning}
                  wordNumber={item.word_number}
                  isFlipped={flippedIds.has(item.word_number)}
                  isTapped={tappedIds.has(item.word_number)}
                  onFlip={() => toggleFlipped(item.word_number)}
                  onTap={() => toggleTapped(item.word_number)}
                  minHeight={item.requiredMinHeight}
                />
              ))}
            </div>

            {/* タブレット・PC用: 2列レイアウト - 従来の表示（フリップなし） */}
            <div ref={desktopGridRef} className="hidden md:grid md:grid-cols-2 md:gap-6">
              <ul>
                {leftWords.map((item: Word) => (
                  <li key={item.word_number} className="mb-6">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleTapped(item.word_number)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleTapped(item.word_number);
                      }}
                      className={`test-card border rounded-xl p-4 shadow-sm min-h-[120px] h-auto flex flex-col transition-colors duration-150 cursor-pointer ${tappedIds.has(item.word_number) ? "bg-red-100 border-red-400 text-red-800" : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2 md:whitespace-nowrap">
                        <span className="text-lg md:text-xl text-gray-900">•</span>
                        <span className="font-medium text-lg md:text-xl text-gray-900">{item.word}（{item.word_number}）</span>
                      </div>
                      <div
                        className={`answer-content mt-3 text-gray-700 break-words min-w-0 transition-all duration-300 ${showAnswers
                          ? "opacity-100"
                          : "opacity-0"
                          }`}
                        style={{
                          display: 'block',
                          maxHeight: 'none',
                          minHeight: '1.5em'
                        }}
                      >
                        {item.meaning}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <ul>
                {rightWords.map((item: Word) => (
                  <li key={item.word_number} className="mb-6">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleTapped(item.word_number)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleTapped(item.word_number);
                      }}
                      className={`test-card border rounded-xl p-4 shadow-sm min-h-[120px] h-auto flex flex-col transition-colors duration-150 cursor-pointer ${tappedIds.has(item.word_number) ? "bg-red-100 border-red-400 text-red-800" : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-2 md:whitespace-nowrap">
                        <span className="text-lg md:text-xl text-gray-900">•</span>
                        <span className="font-medium text-lg md:text-xl text-gray-900">{item.word}（{item.word_number}）</span>
                      </div>
                      <div
                        className={`answer-content mt-3 text-gray-700 break-words min-w-0 transition-all duration-300 ${showAnswers
                          ? "opacity-100"
                          : "opacity-0"
                          }`}
                        style={{
                          display: 'block',
                          maxHeight: 'none',
                          minHeight: '1.5em'
                        }}
                      >
                        {item.meaning}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 印刷警告モーダル */}
          {showPrintWarning && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ⚠️ 語数が多すぎます
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  現在のテストは<strong className="text-red-600">{testData?.words.length}語</strong>です。<br />
                  印刷時のレイアウトは<strong>20語までがおすすめ</strong>です。
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={recreateWith20Words}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    20語で作成し直す
                  </button>
                  <button
                    onClick={() => {
                      setShowPrintWarning(false);
                      executePrint();
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    このまま印刷する
                  </button>
                  <button
                    onClick={() => setShowPrintWarning(false)}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* スマホ用: 縦並びボタンレイアウト */}
          <div className="block md:hidden space-y-3">
            <button
              onClick={() => {
                setShowAnswers((s) => !s);
                // モバイルでは全てのカードを裏向きにする
                if (!showAnswers && Array.isArray(words)) {
                  const allWordNumbers = new Set(words.map((w: Word) => w.word_number));
                  setFlippedIds(allWordNumbers);
                } else {
                  setFlippedIds(new Set());
                }
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg text-lg"
              aria-pressed={showAnswers}
            >
              答え（{showAnswers ? '非表示' : '表示'}）
            </button>
            <button
              onClick={() => {
                const wrongNumbers = Array.from(tappedIds).join(',');
                router.push(`/mistap/results?text=${encodeURIComponent(selectedText)}&start=${startNum}&end=${endNum}&total=${words.length}&wrong=${wrongNumbers}`);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg text-lg font-semibold"
            >
              間違えた単語をタップ完了
            </button>
            <button
              onClick={handleCancel}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-lg text-lg"
            >
              戻る
            </button>
          </div>

          {/* タブレット・PC用: 横並びボタンレイアウト（既存のレイアウトを維持） */}
          <div className="hidden md:flex md:justify-between md:items-center">
            <button
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              戻る
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 hover:border-red-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                title="問題と解答をPDF印刷"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                印刷
              </button>
              <button
                onClick={() => setShowAnswers((s) => !s)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                aria-pressed={showAnswers}
              >
                答え（{showAnswers ? '非表示' : '表示'}）
              </button>
              <button
                onClick={() => {
                  const wrongNumbers = Array.from(tappedIds).join(',');
                  router.push(`/mistap/results?text=${encodeURIComponent(selectedText)}&start=${startNum}&end=${endNum}&total=${words.length}&wrong=${wrongNumbers}`);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                間違えた単語をタップ完了
              </button>
            </div>
          </div>
        </div>
      </Background>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Background className="flex justify-center items-start min-h-screen">
          <div className="text-white text-xl" style={{ marginTop: '25px' }}>Loading...</div>
        </Background>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}