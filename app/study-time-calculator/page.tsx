import React, { Suspense } from 'react';
import StudyTimeCalculator from '@/components/StudyTimeCalculator';

function CalculatorWrapper({
  searchParams,
}: {
  searchParams: { date?: string; name?: string; back?: string };
}) {
  const date = searchParams.date || null;
  const name = searchParams.name || null;
  const back = searchParams.back || '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 sm:py-20">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Study Time Calculator
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
          試験日までの残り日数と、毎日の勉強時間から<br className="hidden sm:block" />
          確保できる総勉強時間をシミュレーションします。
        </p>
      </div>

      <StudyTimeCalculator initialDateStr={date} initialExamName={name} backUrl={back} />
    </div>
  );
}

export default async function Page(props: {
  searchParams: Promise<{ date?: string; name?: string; back?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Suspense fallback={<div className="text-center py-20">読み込み中...</div>}>
      <CalculatorWrapper searchParams={searchParams} />
    </Suspense>
  );
}
