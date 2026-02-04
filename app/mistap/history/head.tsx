const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/history`;
  return (
    <>
      <title>学習履歴 — Mistap</title>
      <meta name="description" content="あなたの過去のテスト結果や学習履歴を確認できます。復習の計画に役立てましょう。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="学習履歴 — Mistap" />
      <meta property="og:description" content="過去のテスト結果や学習履歴を一覧で確認できます。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="学習履歴 — Mistap" />
      <meta name="twitter:description" content="過去のテスト結果や学習履歴を確認しましょう。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
