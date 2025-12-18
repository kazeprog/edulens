import React from 'react';

type Props = {
  keyword: string;     // 例: "兵庫県", "TOEIC L&R", "英検2級"
  suffix?: string;     // 例: "公立高校入試 過去問 2026", "公式問題集"
  trackingId?: string; // あなたのトラッキングID
  daysLeft?: number;   // 残り日数（高校受験で使用）
};

export default function AmazonExamLink({ 
  keyword, 
  suffix = "公立高校入試 過去問 2026", 
  trackingId = "edulens-22",
  daysLeft
}: Props) {
  
  const searchQuery = encodeURIComponent(`${keyword} ${suffix}`);
  const amazonUrl = `https://www.amazon.co.jp/s?k=${searchQuery}&tag=${trackingId}`;

  // ▼ 文言の切り替えロジック ▼
  const upperKeyword = keyword.toUpperCase();
  
  // 1. スコア型（TOEIC, TOEFL, IELTSなど）
  const isScoreBased = upperKeyword.includes("TOEIC") || upperKeyword.includes("TOEFL") || upperKeyword.includes("IELTS");
  
  // 2. 合否型検定（英検, 漢検など）
  // ※ 英検はCSEスコアもありますが、一般的に「合格」を目指すためこちらに分類
  const isCertification = !isScoreBased && (keyword.includes("英検") || keyword.includes("漢検") || keyword.includes("検定"));

  // デフォルト（高校入試・大学入試）
  let titleText = "過去問の準備はお済みですか？";
  let descriptionText = "合格への近道は「過去問」から。志望校の出題傾向を掴んで、本番に備えましょう。";
  let buttonText = `Amazonで ${keyword} の過去問を見る`;

  // 高校受験で残り日数が渡された場合
  if (daysLeft !== undefined && keyword.includes("高校入試")) {
    const daysPerSubject = Math.floor(daysLeft / 5);
    titleText = "過去問の準備はお済みですか？";
    descriptionText = (
      <>
        <strong>受験まであと{daysLeft}日、1科目あたり約{daysPerSubject}日です。</strong>
        <br />
        過去問を準備し早めに取り掛かりましょう！
      </>
    );
  }

  if (isScoreBased) {
    // スコア型用メッセージ
    titleText = "目標スコア達成の準備はOKですか？";
    descriptionText = "スコアアップの近道は「公式問題集」での演習です。本番の形式に慣れて、自己ベスト更新を目指しましょう。";
    buttonText = `Amazonで ${keyword} の問題集を見る`;
  } else if (isCertification) {
    // 検定用メッセージ
    titleText = "検定対策の準備はお済みですか？";
    descriptionText = "合格への近道は「過去問」や「予想問題」から。傾向を掴んで、一発合格を目指しましょう。";
    buttonText = `Amazonで ${keyword} の問題集を見る`;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-12 px-4">
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center shadow-sm">
        <h3 className="text-slate-800 font-bold mb-3 text-lg flex items-center justify-center gap-2">
           {/* 本のアイコン */}
           <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
           {titleText}
        </h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {descriptionText}
        </p>
        
        <a 
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#ffad33] text-white text-base font-bold py-3 px-8 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <span>{buttonText}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  );
}