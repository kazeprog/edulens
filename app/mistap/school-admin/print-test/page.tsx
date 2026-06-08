'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Printer } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { getJsonTextbookData } from '@/lib/mistap/jsonTextbookData';

type PrintWord = {
  word_number: number;
  word: string;
  meaning: string;
};

type PrintTestPayload = {
  selectedText: string;
  rangeLabel: string;
  startNum: number | null;
  endNum: number | null;
  mode: 'word-meaning' | 'meaning-word' | string | null;
  studentName: string;
  grade: string | null;
  createdAt: string | null;
  words: PrintWord[];
};

const TEST_WORD_LIMIT = 20;

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeMode(mode: string | null) {
  return mode === 'meaning-word' ? 'meaning-word' : 'word-meaning';
}

function getRangeLabel(startNum: number | null, endNum: number | null) {
  if (startNum != null && endNum != null) return `No.${startNum}-${endNum}`;
  return '全範囲';
}

function getPrompt(word: PrintWord, mode: string | null) {
  return normalizeMode(mode) === 'meaning-word' ? word.meaning : word.word;
}

function getAnswer(word: PrintWord, mode: string | null) {
  return normalizeMode(mode) === 'meaning-word' ? word.word : word.meaning;
}

function getPromptLabel(mode: string | null) {
  return normalizeMode(mode) === 'meaning-word' ? '意味' : '単語';
}

function getAnswerLabel(mode: string | null) {
  return normalizeMode(mode) === 'meaning-word' ? '単語' : '意味';
}

function getModeLabel(mode: string | null) {
  return normalizeMode(mode) === 'meaning-word' ? '意味→単語' : '単語→意味';
}

function dedupeAndSortWords(words: PrintWord[]) {
  const seen = new Set<string>();
  return words
    .filter((word) => word.word?.trim() && word.meaning?.trim())
    .filter((word) => {
      const key = `${word.word_number}-${word.word}-${word.meaning}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Number(a.word_number || 0) - Number(b.word_number || 0));
}

function pickRandomWords(words: PrintWord[], limit = TEST_WORD_LIMIT) {
  return [...dedupeAndSortWords(words)]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

function PrintLogo() {
  return (
    <div className="absolute bottom-8 right-10 print:bottom-0 print:right-0">
      <Image
        src="/mistap-logo.png"
        alt="Mistap"
        width={160}
        height={40}
        className="h-auto w-32 opacity-80 print:w-36"
        unoptimized
      />
    </div>
  );
}

function PrintTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<PrintTestPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPrintTest() {
      setLoading(true);
      setError(null);

      try {
        const dataKey = searchParams.get('dataKey');
        if (dataKey) {
          const rawPayload = window.localStorage.getItem(dataKey) || window.sessionStorage.getItem(dataKey);
          if (!rawPayload) {
            throw new Error('印刷用テストデータが見つかりませんでした。');
          }

          const parsedPayload = JSON.parse(rawPayload) as PrintTestPayload;
          if (!Array.isArray(parsedPayload.words) || parsedPayload.words.length === 0) {
            throw new Error('印刷できる単語がありません。');
          }

          if (isMounted) {
            setPayload({
              ...parsedPayload,
              words: pickRandomWords(parsedPayload.words),
            });
          }
          return;
        }

        const selectedText = searchParams.get('text');
        const startNum = searchParams.get('start') ? Number(searchParams.get('start')) : null;
        const endNum = searchParams.get('end') ? Number(searchParams.get('end')) : null;
        const count = searchParams.get('count') ? Number(searchParams.get('count')) : TEST_WORD_LIMIT;
        const mode = searchParams.get('mode') || 'word-meaning';

        if (!selectedText || startNum == null || endNum == null) {
          throw new Error('印刷用テストの範囲が指定されていません。');
        }

        let words = getJsonTextbookData(selectedText)
          ?.filter((word) => word.word_number >= startNum && word.word_number <= endNum)
          .map((word) => ({
            word_number: word.word_number,
            word: word.word,
            meaning: word.meaning,
          })) || [];

        if (words.length === 0) {
          const supabase = getSupabase();
          if (supabase) {
            const { data } = await supabase
              .from('words')
              .select('word, word_number, meaning')
              .eq('text', selectedText)
              .gte('word_number', startNum)
              .lte('word_number', endNum);

            words = (data || []) as PrintWord[];
          }
        }

        const finalWords = pickRandomWords(words, Math.max(1, Math.min(TEST_WORD_LIMIT, count || TEST_WORD_LIMIT)));
        if (finalWords.length === 0) {
          throw new Error('指定された範囲の単語が見つかりませんでした。');
        }

        if (isMounted) {
          setPayload({
            selectedText,
            rangeLabel: getRangeLabel(startNum, endNum),
            startNum,
            endNum,
            mode,
            studentName: searchParams.get('student') || '生徒',
            grade: null,
            createdAt: searchParams.get('date'),
            words: finalWords,
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : '印刷用テストの作成に失敗しました。');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadPrintTest();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const title = useMemo(() => {
    if (!payload) return '単語テスト';
    return `${payload.selectedText} ${payload.rangeLabel} 小テスト`;
  }, [payload]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center text-sm font-bold text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          印刷用テストを作成中...
        </div>
      </main>
    );
  }

  if (error || !payload) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-black text-slate-900">印刷用テストを作成できませんでした</h1>
          <p className="mt-3 text-sm text-red-700">{error || 'データが見つかりませんでした。'}</p>
          <button
            type="button"
            onClick={() => router.push('/mistap/school-admin')}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            管理画面に戻る
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 print:bg-white print:p-0">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          header,
          nav,
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .print-sheet {
            box-shadow: none !important;
            border: 0 !important;
            max-width: none !important;
            min-height: auto !important;
            padding: 0 !important;
          }

          .test-page {
            min-height: 273mm;
          }

          .question-page {
            break-after: page;
            page-break-after: always;
          }

          .answer-key {
            min-height: 273mm;
          }

          .question-row td {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-4xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/mistap/school-admin')}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          管理画面に戻る
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          <Printer className="h-4 w-4" />
          印刷
        </button>
      </div>

      <article className="print-sheet mx-auto max-w-4xl bg-white shadow-sm">
        <section className="test-page question-page relative min-h-[297mm] p-10 pb-20 print:min-h-0 print:p-0">
          <div className="flex items-start justify-between gap-6 border-b-2 border-slate-950 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-normal">{title}</h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold text-slate-700">
                <span>生徒: {payload.studentName}</span>
                <span>学年: {payload.grade || '未設定'}</span>
                <span>実施: {formatDate(payload.createdAt)}</span>
                <span>形式: {getModeLabel(payload.mode)}</span>
              </div>
            </div>
            <div className="min-w-48 text-sm font-bold">
              <div className="border-b border-slate-400 pb-2">氏名</div>
              <div className="mt-8 border-b border-slate-400 pb-2">点数　　　　/ {payload.words.length}</div>
            </div>
          </div>

          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-slate-900">
                <th className="w-14 py-2 text-left font-black">No.</th>
                <th className="py-2 text-left font-black">{getPromptLabel(payload.mode)}</th>
                <th className="w-[42%] py-2 text-left font-black">{getAnswerLabel(payload.mode)}</th>
              </tr>
            </thead>
            <tbody>
              {payload.words.map((word, index) => (
                <tr key={`${word.word_number}-${word.word}-${index}`} className="question-row border-b border-slate-200">
                  <td className="py-2.5 pr-3 align-top font-mono text-xs text-slate-500">{index + 1}</td>
                  <td className="py-2.5 pr-5 align-top text-base font-bold">{getPrompt(word, payload.mode)}</td>
                  <td className="py-2.5 align-top">
                    <div className="h-6 border-b border-slate-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PrintLogo />
        </section>

        <section className="answer-key test-page relative min-h-[297mm] p-10 pb-20 print:min-h-0 print:p-0">
          <div className="border-b-2 border-slate-950 pb-4">
            <h2 className="text-2xl font-black tracking-normal">{title} 解答</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold text-slate-700">
              <span>生徒: {payload.studentName}</span>
              <span>学年: {payload.grade || '未設定'}</span>
              <span>形式: {getModeLabel(payload.mode)}</span>
            </div>
          </div>
          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-slate-900">
                <th className="w-14 py-2 text-left font-black">No.</th>
                <th className="py-2 text-left font-black">{getPromptLabel(payload.mode)}</th>
                <th className="w-[42%] py-2 text-left font-black">{getAnswerLabel(payload.mode)}</th>
              </tr>
            </thead>
            <tbody>
              {payload.words.map((word, index) => (
                <tr key={`answer-${word.word_number}-${word.word}-${index}`} className="question-row border-b border-slate-200">
                  <td className="py-2.5 pr-3 align-top font-mono text-xs text-slate-500">{index + 1}</td>
                  <td className="py-2.5 pr-5 align-top text-base font-bold">{getPrompt(word, payload.mode)}</td>
                  <td className="py-2.5 align-top text-base font-bold">{getAnswer(word, payload.mode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PrintLogo />
        </section>
      </article>
    </main>
  );
}

export default function MistapSchoolPrintTestPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-slate-50">
          <div className="flex min-h-[70vh] items-center justify-center text-sm font-bold text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            印刷用テストを作成中...
          </div>
        </main>
      )}
    >
      <PrintTestContent />
    </Suspense>
  );
}
