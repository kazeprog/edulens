'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import FlippableCard from "@/components/mistap/FlippableCard";
import TestCard from "@/components/mistap/TestCard";
import PrintWarningModal from "@/components/mistap/PrintWarningModal";
import { MobileActionButtons, DesktopActionButtons } from "@/components/mistap/TestActionButtons";
import MistapFooter from "@/components/mistap/Footer";
import GoogleAdsense from "@/components/GoogleAdsense";

interface Word {
  word_number: number;
  word: string;
  meaning: string;
  requiredMinHeight?: number;
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
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.width = `${mobileCardsRef.current?.offsetWidth || 300}px`;
      document.body.appendChild(tempContainer);

      const wordsWithCalculatedHeights = testData.words.map(word => {
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

        const requiredMinHeight = Math.ceil(Math.max(frontHeight, backHeight) + 8);

        return { ...word, requiredMinHeight };
      });

      document.body.removeChild(tempContainer);
      setWordsWithHeights(wordsWithCalculatedHeights);
    };

    const timer = setTimeout(calculateCardHeights, 100);
    return () => clearTimeout(timer);
  }, [testData]);

  // Adjust all card heights to match the tallest card on desktop
  useEffect(() => {
    const adjustHeights = () => {
      if (!desktopGridRef.current) return;
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        Array.from(desktopGridRef.current.querySelectorAll<HTMLElement>('.test-card')).forEach((el: HTMLElement) => {
          el.style.height = '';
        });
        return;
      }

      const cards = Array.from(desktopGridRef.current.querySelectorAll<HTMLElement>('.test-card')) as HTMLElement[];
      if (cards.length === 0) return;

      cards.forEach((el: HTMLElement) => { el.style.height = 'auto'; });

      const answerElements = cards.map(card => {
        const answerEl = card.querySelector('.answer-content') as HTMLElement | null;
        const prevOpacity = answerEl?.style.opacity || '';
        if (answerEl) { answerEl.style.opacity = '1'; }
        return { answerEl, prevOpacity };
      });

      void cards[0]?.offsetHeight;

      let max = 0;
      cards.forEach((el: HTMLElement) => {
        const h = el.getBoundingClientRect().height;
        if (h > max) max = h;
      });

      answerElements.forEach(({ answerEl, prevOpacity }) => {
        if (answerEl) { answerEl.style.opacity = prevOpacity; }
      });

      if (max > 0) {
        cards.forEach((el: HTMLElement) => { el.style.height = `${Math.ceil(max)}px`; });
      }
    };

    if (!testData) return;

    const t = window.setTimeout(() => {
      requestAnimationFrame(() => { adjustHeights(); });
    }, 100);

    const grid = desktopGridRef.current;
    return () => {
      clearTimeout(t);
      if (grid) {
        Array.from(grid.querySelectorAll<HTMLElement>('.test-card')).forEach((el: HTMLElement) => el.style.height = '');
      }
    };
  }, [testData]);

  useEffect(() => {
    document.title = '英単語テスト - Mistap';

    const textParam = searchParams.get('text');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    const countParam = searchParams.get('count');

    if (textParam && startParam && endParam && countParam) {
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
            router.push('/mistap/test-setup');
            return;
          }

          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);
          setTestData({ selectedText, words: shuffled, startNum, endNum });
        } catch {
          router.push('/mistap/test-setup');
        }
      };
      generateTest();
      return;
    }

    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        let decodedData: string;
        try { decodedData = decodeURIComponent(dataParam); }
        catch { decodedData = dataParam; }
        const parsedData = JSON.parse(decodedData);
        setTestData(parsedData);
      } catch {
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
    if (testData.words.length > 20) {
      setShowPrintWarning(true);
      return;
    }
    executePrint();
  }

  function executePrint() {
    if (!testData) return;
    const { words, selectedText, startNum, endNum } = testData;

    const title = (selectedText === "過去形" || selectedText === "過去形、過去分詞形")
      ? `${selectedText} 小テスト`
      : (startNum != null && endNum != null)
        ? `${selectedText}(${startNum}〜${endNum}) 小テスト`
        : `${selectedText} 小テスト`;

    const leftWords = words.filter((_: Word, i: number) => i % 2 === 0);
    const rightWords = words.filter((_: Word, i: number) => i % 2 === 1);

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @media print { @page { margin: 15mm 20mm; size: A4; } .page-break { page-break-after: always; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Yu Gothic', 'Hiragino Sans', sans-serif; line-height: 1.6; color: #333; padding: 0; }
    .page { min-height: 100vh; display: flex; flex-direction: column; }
    h1 { text-align: center; font-size: 22px; margin-bottom: 16px; border-bottom: 2px solid #333; padding-bottom: 8px; flex-shrink: 0; }
    .two-column-container { display: flex; gap: 20px; flex: 1; align-items: stretch; }
    .column { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .word-item { padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; background: #fafafa; min-height: 60px; display: flex; flex-direction: column; justify-content: center; }
    .word-number { font-weight: bold; font-size: 15px; margin-bottom: 4px; }
    .meaning { color: #555; font-size: 13px; line-height: 1.5; }
    .answer-section .meaning { display: block; }
    .problem-section .meaning { display: none; }
  </style>
</head>
<body>
  <div class="page problem-section">
    <h1>${title}</h1>
    <div class="two-column-container">
      <div class="column">${leftWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word}（${w.word_number}）</div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
      <div class="column">${rightWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word}（${w.word_number}）</div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
    </div>
  </div>
  <div class="page-break"></div>
  <div class="page answer-section">
    <h1>${title} - 解答</h1>
    <div class="two-column-container">
      <div class="column">${leftWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word}（${w.word_number}）</div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
      <div class="column">${rightWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word}（${w.word_number}）</div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }

  function recreateWith20Words() {
    if (!testData) return;
    const { selectedText, startNum } = testData;
    const newEndNum = startNum != null ? startNum + 19 : 20;
    router.push(`/mistap/test?text=${encodeURIComponent(selectedText)}&start=${startNum || 1}&end=${newEndNum}&count=20`);
    setShowPrintWarning(false);
  }

  function handleToggleAnswers() {
    setShowAnswers((s) => !s);
    if (!showAnswers && Array.isArray(testData?.words)) {
      const allWordNumbers = new Set(testData.words.map((w: Word) => w.word_number));
      setFlippedIds(allWordNumbers);
    } else {
      setFlippedIds(new Set());
    }
  }

  function handleFinish() {
    if (!testData) return;
    const { selectedText, startNum, endNum, words } = testData;
    const wrongNumbers = Array.from(tappedIds).join(',');
    // 正解した単語番号を計算（タップされていない単語）
    const correctNumbers = words
      .filter((w: Word) => !tappedIds.has(w.word_number))
      .map((w: Word) => w.word_number)
      .join(',');
    router.push(`/mistap/results?text=${encodeURIComponent(selectedText)}&start=${startNum}&end=${endNum}&total=${words.length}&wrong=${wrongNumbers}&correct=${correctNumbers}`);
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

  const testTitle = selectedText ? (
    (selectedText === "過去形" || selectedText === "過去形、過去分詞形") ?
      `${selectedText} 小テスト` :
      (startNum != null && endNum != null) ?
        `${selectedText}(${startNum}〜${endNum}) 小テスト` :
        `${selectedText} 小テスト`
  ) : "小テスト";

  return (
    <div className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full md:max-w-6xl border border-white/50" style={{ marginTop: '25px' }}>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6" translate="no">
            {testTitle}
          </h1>

          <div className="mb-3 md:mb-8" translate="no">
            {/* Mobile: Flip cards */}
            <div ref={mobileCardsRef} className="block md:hidden" style={{ maxWidth: '100%' }}>
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

            {/* Desktop: 2-column layout */}
            <div ref={desktopGridRef} className="hidden md:grid md:grid-cols-2 md:gap-6">
              <ul>
                {leftWords.map((item: Word) => (
                  <li key={item.word_number} className="mb-6">
                    <TestCard
                      word={item}
                      isTapped={tappedIds.has(item.word_number)}
                      showAnswers={showAnswers}
                      onTap={() => toggleTapped(item.word_number)}
                    />
                  </li>
                ))}
              </ul>
              <ul>
                {rightWords.map((item: Word) => (
                  <li key={item.word_number} className="mb-6">
                    <TestCard
                      word={item}
                      isTapped={tappedIds.has(item.word_number)}
                      showAnswers={showAnswers}
                      onTap={() => toggleTapped(item.word_number)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:hidden mb-6">
            <GoogleAdsense
              style={{ display: 'block', width: '100%', minHeight: '100px' }}
              format="rectangle"
              responsive="true"
            />
          </div>

          <MobileActionButtons
            showAnswers={showAnswers}
            onToggleAnswers={handleToggleAnswers}
            onFinish={handleFinish}
            onCancel={handleCancel}
          />

          <DesktopActionButtons
            showAnswers={showAnswers}
            onToggleAnswers={() => setShowAnswers((s) => !s)}
            onFinish={handleFinish}
            onCancel={handleCancel}
            onPrint={handlePrint}
          />
        </div>
      </Background>
      <MistapFooter />
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