const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/results`;
  return (
    <>
      <title>テスト結果 — Mistap</title>
      <meta name="description" content="最新のテスト結果と詳細な成績を確認できます。間違えた単語の復習に役立ちます。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="テスト結果 — Mistap" />
      <meta property="og:description" content="テストの成績を確認し、復習プランを立てましょう。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="テスト結果 — Mistap" />
      <meta name="twitter:description" content="テストの成績を確認して、苦手を克服しましょう。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
