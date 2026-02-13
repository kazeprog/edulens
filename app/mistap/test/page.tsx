'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/mistap/supabaseClient";
import Background from "@/components/mistap/Background";
import FlippableCard from "@/components/mistap/FlippableCard";
import TestCard from "@/components/mistap/TestCard";
// import PrintWarningModal from "@/components/mistap/PrintWarningModal"; // Removed
import { MobileActionButtons, DesktopActionButtons } from "@/components/mistap/TestActionButtons";
import MistapFooter from "@/components/mistap/Footer";
import GoogleAdsense from "@/components/GoogleAdsense";
import { normalizeTextbookName } from "@/lib/mistap/textbookUtils";
import { getJsonTextbookData } from "@/lib/mistap/jsonTextbookData";
import { useAuth } from "@/context/AuthContext";

interface Word {
  word_number: number;
  word: string;
  meaning: string;
  requiredMinHeight?: number;
}

interface TestData {
  words: Word[];
  selectedText: string;
  startNum: number | null;
  endNum: number | null;
  mode?: 'word-meaning' | 'meaning-word' | 'word-stock';
}

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [tappedIds, setTappedIds] = useState<Set<number>>(new Set());
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  // const [showPrintWarning, setShowPrintWarning] = useState<boolean>(false); // Removed
  const desktopGridRef = useRef<HTMLDivElement | null>(null);
  const mobileCardsRef = useRef<HTMLDivElement | null>(null);
  const [wordsWithHeights, setWordsWithHeights] = useState<Word[]>([]);
  const { profile, loading } = useAuth();

  const testTitle = useMemo(() => {
    const selectedText = testData?.selectedText;
    const startNum = testData?.startNum;
    const endNum = testData?.endNum;

    if (!selectedText) return "小テスト";

    // 特殊なタイトルの場合
    if (selectedText === "過去形" || selectedText === "過去形、過去分詞形") {
      return <span>{selectedText} 小テスト</span>;
    }

    const normalized = normalizeTextbookName(selectedText);
    let unitLabel = null;

    // 教科書テスト（Lesson指定）または復習テストの場合の単元名抽出
    if ((startNum == null || endNum == null) && selectedText.startsWith(normalized) && selectedText.length > normalized.length) {
      let suffix = selectedText.substring(normalized.length).replace(/^[\s-–—]+/, '').trim();

      // 復習テストの括弧を除去
      if (suffix.includes('復習テスト')) {
        suffix = suffix.replace(/[（(]復習テスト[)）]/, '復習テスト').trim();
      }

      // 学習状況カテゴリの括弧を除去
      suffix = suffix.replace(/[（(](覚えた|要チェック|覚えていない)[^)）]*[)）]/g, '$1単語').trim();

      if (suffix) {
        unitLabel = suffix.replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    if (unitLabel) {
      return (
        <span className="flex flex-col items-center">
          <span>{normalized}</span>
          <span className="text-xl mt-1">{unitLabel} 小テスト</span>
        </span>
      );
    }

    // 通常の単語番号指定の場合
    return (startNum != null && endNum != null) ?
      `${selectedText}(${startNum}〜${endNum}) 小テスト` :
      `${selectedText} 小テスト`;

  }, [testData]);


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
    const modeParam = searchParams.get('mode');
    const mode = (modeParam === 'meaning-word') ? 'meaning-word' : (modeParam === 'word-stock' ? 'word-stock' : 'word-meaning');

    if (loading) return;

    // Handle Word Stock Mode
    if (mode === 'word-stock') {
      const fetchWordStock = async () => {
        if (!profile?.is_pro) {
          alert("この機能を使用するにはProプランへのアップグレードが必要です。");
          router.push('/upgrade');
          return;
        }

        const countParam = searchParams.get('count');
        const count = countParam ? parseInt(countParam) : 10;

        const { data, error } = await supabase
          .from('mistap_word_stocks')
          .select('*');

        if (error || !data || data.length === 0) {
          alert("ストックされた単語がありません。");
          router.push('/mistap/word-stock');
          return;
        }

        // Shuffle and limit
        const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);

        // Map to Word interface
        const words: Word[] = shuffled.map((item, index) => ({
          word_number: index + 1, // Dummy number
          word: item.word,
          meaning: item.meaning || '',
        }));

        setTestData({
          selectedText: 'Word Stock',
          words: words,
          startNum: null,
          endNum: null,
          mode: 'word-stock'
        });
      };

      fetchWordStock();
      return;
    }

    if (textParam && startParam && endParam && countParam) {
      const generateTest = async () => {
        try {
          const selectedText = decodeURIComponent(textParam);
          const startNum = parseInt(startParam);
          const endNum = parseInt(endParam);
          let count = parseInt(countParam);

          // Force 50 word limit for non-pro
          if (!profile?.is_pro && count > 50) {
            count = 50;
          }

          let data: any[] | null = null;
          let error = null;

          // ローカルJSONデータを試行
          const localData = getJsonTextbookData(selectedText);

          if (localData && localData.length > 0) {
            data = localData.filter(w =>
              w.word_number >= startNum &&
              w.word_number <= endNum
            ).map(w => ({
              word: w.word,
              word_number: w.word_number,
              meaning: w.meaning
            }));
          } else {
            // ローカルになければSupabaseへ
            const result = await supabase
              .from("words")
              .select("word, word_number, meaning")
              .eq("text", selectedText)
              .gte("word_number", startNum)
              .lte("word_number", endNum);
            data = result.data;
            error = result.error;
          }

          if (error || !data || data.length === 0) {
            router.push('/mistap/test-setup');
            return;
          }

          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);
          setTestData({ selectedText, words: shuffled, startNum, endNum, mode });
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

        // Force 50 word limit for non-pro
        if (!profile?.is_pro && parsedData.words && parsedData.words.length > 50) {
          parsedData.words = parsedData.words.slice(0, 50);
        }

        setTestData(parsedData);
      } catch {
        router.push('/mistap/test-setup');
      }
    } else {
      router.push('/mistap/test-setup');
    }
  }, [searchParams, router, loading, profile]);

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

    // Dynamic Scaling Logic
    const rowCount = Math.ceil(words.length / 2);

    // Base values for standard 20 words (10 rows)
    // A4 printable height approx 250mm-260mm for content excluding title
    // Let's calculate based on density.

    let fontSizeWord = 16;
    let fontSizeMeaning = 14;
    let itemPaddingV = 5;
    let itemPaddingH = 12;
    let gap = 10;

    // Scale down if rows increase
    if (rowCount > 10) {
      // Slightly reduce as rows increase
      const scaleFactor = Math.max(0.4, 1 - ((rowCount - 10) * 0.03));
      // Decaying scale factor: 0.03 per extra row is a rough guess
      // 20 rows (40 words) -> 1 - 0.3 = 0.7 
      // 50 rows (100 words) -> 1 - 1.2 = negative -> need better curve or floor

      // Alternative: Calculate max height per row
      // Available height for list approx 240mm
      const availableHeightMm = 240;
      const heightPerRowMm = availableHeightMm / rowCount;

      // Heuristic mapping from height per row to font size/padding
      if (heightPerRowMm < 8) { // Very dense
        fontSizeWord = Math.max(9, heightPerRowMm * 1.2);
        fontSizeMeaning = Math.max(8, heightPerRowMm * 1.0);
        itemPaddingV = Math.max(1, heightPerRowMm * 0.2);
        gap = Math.max(2, heightPerRowMm * 0.3);
      } else if (heightPerRowMm < 12) { // Dense
        fontSizeWord = 12;
        fontSizeMeaning = 10;
        itemPaddingV = 3;
        gap = 5;
      } else if (heightPerRowMm < 18) { // Middle
        fontSizeWord = 14;
        fontSizeMeaning = 12;
        itemPaddingV = 4;
        gap = 8;
      }
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    /* リセットと基本設定 */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Yu Gothic', 'Hiragino Sans', sans-serif; 
      line-height: 1.3; 
      color: #333;
      background: #f0f0f0; 
    }

    /* ページの基本スタイル */
    .page {
      background: white;
      width: 210mm; 
      height: 297mm; 
      padding: 15mm 25mm;
      margin: 20px auto; 
      display: flex; 
      flex-direction: column; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    h1 { 
      text-align: center; 
      font-size: 20px; 
      margin-bottom: 10px; 
      border-bottom: 2px solid #333; 
      padding-bottom: 5px; 
      flex-shrink: 0; 
    }
    
    .two-column-container { 
      display: flex; 
      gap: 15px; 
      flex: 1; 
      overflow: hidden; 
    }
    
    .column { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      gap: ${gap}px; 
    }
    
    .word-item { 
      flex: 1;
      padding: ${itemPaddingV}px ${itemPaddingH}px; 
      border: 1px solid #ccc; 
      border-radius: 6px; 
      background: transparent; /* 背景色なし */
      display: flex; 
      flex-direction: row; 
      align-items: center; 
      justify-content: space-between; 
      gap: 10px;
      min-height: 0;
    }
    
    .word-number { 
      font-weight: bold; 
      font-size: ${fontSizeWord}px; 
      margin-bottom: 0; 
      flex-shrink: 0; 
    }
    
    .meaning { 
      color: #333; 
      font-size: ${fontSizeMeaning}px; 
      line-height: 1.2; 
      text-align: right; 
      font-weight: 500; 
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 65%;
    }
    
    .answer-section .meaning { display: block; }
    .problem-section .meaning { display: none; }

    /* フッター設定 */
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      margin-top: auto; /* 下部に押し下げ */
      padding-top: 15px;
      gap: 15px;
      border-top: 1px solid #eee;
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .footer-logo {
      height: 24px;
      margin-bottom: 2px;
    }
    .footer-url {
      font-size: 10px;
      color: #666;
    }
    .footer-qr {
      width: 40px;
      height: 40px;
    }

    /* 印刷時の設定 */
    @media print { 
      @page { margin: 0; size: A4; }
      html, body { 
        margin: 0 !important; 
        padding: 0 !important; 
        background: white !important; 
        width: 100%;
        height: 100%;
      }
      .page { 
        width: 100% !important; 
        margin: 0 !important; 
        padding: 15mm 25mm !important; 
        box-shadow: none !important; 
        page-break-after: always;
        height: 100%; 
        min-height: 297mm;
        overflow: hidden !important; 
      }
      .page-break { display: none; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page problem-section">
    <h1>${title}</h1>
    <div class="two-column-container">
      <div class="column">${leftWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word} <span style="font-size: 0.85em; font-weight: normal; margin-left: 2px;">(${w.word_number})</span></div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
      <div class="column">${rightWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word} <span style="font-size: 0.85em; font-weight: normal; margin-left: 2px;">(${w.word_number})</span></div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
    </div>
    <div class="footer">
      <div class="footer-left">
        <img src="${window.location.origin}/mistap-logo.png" class="footer-logo" alt="Mistap Logo">
        <div class="footer-url">https://edulens.jp/mistap</div>
      </div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://edulens.jp/mistap" class="footer-qr" alt="QR Code">
    </div>
  </div>
  
  <div class="page answer-section">
    <h1>${title} - 解答</h1>
    <div class="two-column-container">
      <div class="column">${leftWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word} <span style="font-size: 0.85em; font-weight: normal; margin-left: 2px;">(${w.word_number})</span></div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
      <div class="column">${rightWords.map(w => `<div class="word-item"><div class="word-number">• ${w.word} <span style="font-size: 0.85em; font-weight: normal; margin-left: 2px;">(${w.word_number})</span></div><div class="meaning">${w.meaning}</div></div>`).join('')}</div>
    </div>
    <div class="footer">
      <div class="footer-left">
        <img src="${window.location.origin}/mistap-logo.png" class="footer-logo" alt="Mistap Logo">
        <div class="footer-url">https://edulens.jp/mistap</div>
      </div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://edulens.jp/mistap" class="footer-qr" alt="QR Code">
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
    const { selectedText, startNum, mode } = testData;
    const newEndNum = startNum != null ? startNum + 19 : 20;
    router.push(`/mistap/test?text=${encodeURIComponent(selectedText)}&start=${startNum || 1}&end=${newEndNum}&count=20&mode=${mode || 'word-meaning'}`);
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

  async function handleFinish() {
    if (!testData) return;

    // Increment test count for authenticated users
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fire and forget, or await? 
        // Await to ensure reliability, but keep UI responsive?
        // Let's await to be safe, it shouldn't take long.
        await supabase.rpc('increment_profile_test_count', { p_user_id: user.id });
      }
    } catch (err) {
      console.error('Failed to increment test count:', err);
    }

    const { selectedText, startNum, endNum, words, mode } = testData;

    // 教科書テストの場合（startNum/endNumがnull）は、単語データを直接渡す
    const isTextbookTest = (testData as { isTextbookTest?: boolean }).isTextbookTest || (startNum == null && endNum == null);

    if (isTextbookTest) {
      // 間違えた単語と正解した単語を抽出
      const tappedWords = words.filter((w: Word) => tappedIds.has(w.word_number));
      const correctWords = words.filter((w: Word) => !tappedIds.has(w.word_number));

      // 結果データをJSONで渡す
      const resultData = {
        tappedWords,
        correctWords,
        total: words.length,
        selectedText,
        startNum: null,
        endNum: null,
        mode: mode || 'word-meaning'
      };
      const dataParam = encodeURIComponent(JSON.stringify(resultData));
      router.push(`/mistap/results?data=${dataParam}&t=${Date.now()}`);
    } else {
      // 従来の単語帳テスト：単語番号のみ渡してSupabaseから取得
      const wrongNumbers = Array.from(tappedIds).join(',');
      const correctNumbers = words
        .filter((w: Word) => !tappedIds.has(w.word_number))
        .map((w: Word) => w.word_number)
        .join(',');
      router.push(`/mistap/results?text=${encodeURIComponent(selectedText)}&start=${startNum}&end=${endNum}&total=${words.length}&wrong=${wrongNumbers}&correct=${correctNumbers}&mode=${mode || 'word-meaning'}&t=${Date.now()}`);
    }
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

  const { words, selectedText, startNum, endNum, mode } = testData;
  const isMeaningToWord = mode === 'meaning-word';

  // Prepare words for display based on mode
  const displayWords = words.map(w => ({
    ...w,
    originalWord: w.word, // Keep original English word for audio and back face
    originalMeaning: w.meaning, // Keep original meaning for back face
    word: isMeaningToWord ? w.meaning : w.word, // Display Meaning as Word
    meaning: isMeaningToWord ? w.word : w.meaning, // Display Word as Meaning (Answer)
  })) as (Word & { originalWord: string; originalMeaning: string })[];


  const leftWords = Array.isArray(displayWords) ? displayWords.filter((_, i) => i % 2 === 0) : [];
  const rightWords = Array.isArray(displayWords) ? displayWords.filter((_, i) => i % 2 === 1) : [];



  return (
    <div className="min-h-screen">
      <Background className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white/40 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 w-full md:max-w-6xl border border-white/50" style={{ marginTop: '25px' }}>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6" translate="no">
            {testTitle}
          </h1>

          <div className="mb-3 md:mb-8" translate="no">
            {/* Mobile: Flip cards */}
            <div ref={mobileCardsRef} className="block md:hidden px-3" style={{ maxWidth: '100%' }}>
              {displayWords.map((item, idx: number) => {
                // Merge height data from wordsWithHeights if available
                const heightData = wordsWithHeights.find(w => w.word_number === item.word_number);
                const minHeight = heightData?.requiredMinHeight;

                return (
                  <React.Fragment key={`${item.word_number}-${idx}`}>
                    <FlippableCard
                      word={item.word}
                      meaning={item.meaning}
                      wordNumber={item.word_number}
                      isFlipped={flippedIds.has(item.word_number)}
                      isTapped={tappedIds.has(item.word_number)}
                      onFlip={() => toggleFlipped(item.word_number)}
                      onTap={() => toggleTapped(item.word_number)}
                      minHeight={minHeight}
                      audioText={item.originalWord}
                      originalWord={item.originalWord}
                      originalMeaning={item.originalMeaning}
                    />
                    {(idx + 1) % 5 === 0 && idx !== displayWords.length - 1 && (
                      <div className="w-full my-4" style={{ minHeight: '120px' }}>
                        <GoogleAdsense
                          slot="2643309624"
                          format="fluid"
                          layoutKey="-f7+5u+4t-da+6l"
                          responsive="true"
                          style={{ display: 'block', minHeight: '120px' }}
                          disableRefresh={true}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}


            </div>

            {/* Desktop: 2-column layout */}
            <div ref={desktopGridRef} className="hidden md:grid md:grid-cols-2 md:gap-6">
              <ul>
                {leftWords.map((item, idx: number) => (
                  <li key={`${item.word_number}-left-${idx}`} className="mb-6">
                    <TestCard
                      word={item}
                      isTapped={tappedIds.has(item.word_number)}
                      showAnswers={showAnswers}
                      onTap={() => toggleTapped(item.word_number)}
                      audioText={item.originalWord}
                    />
                    {(idx + 1) % 5 === 0 && idx !== leftWords.length - 1 && (
                      <GoogleAdsense
                        slot="2643309624"
                        format="fluid"
                        layoutKey="-f7+5u+4t-da+6l"
                        className="my-8"
                        style={{ display: 'block', minHeight: '120px' }}
                        disableRefresh={true}
                      />
                    )}
                  </li>
                ))}
              </ul>
              <ul>
                {rightWords.map((item, idx: number) => (
                  <li key={`${item.word_number}-right-${idx}`} className="mb-6">
                    <TestCard
                      word={item}
                      isTapped={tappedIds.has(item.word_number)}
                      showAnswers={showAnswers}
                      onTap={() => toggleTapped(item.word_number)}
                      audioText={item.originalWord}
                    />
                    {(idx + 1) % 5 === 0 && idx !== rightWords.length - 1 && (
                      <GoogleAdsense
                        slot="2643309624"
                        format="fluid"
                        layoutKey="-f7+5u+4t-da+6l"
                        className="my-8"
                        style={{ display: 'block', minHeight: '120px' }}
                        disableRefresh={true}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AdSense - contain: layout paint でレイアウト隔離 */}
          <div
            className="md:hidden mb-6 w-full overflow-hidden"
            style={{
              maxWidth: '100%',
              minHeight: '250px',
              contain: 'layout paint'
            }}
          >
            <GoogleAdsense
              style={{ display: 'block', width: '100%', minHeight: '250px' }}
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