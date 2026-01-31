const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/results`;
  return (
    <>
      <title>テスト結果 — Mistap</title>
      <meta name="description" content="テスト結果の確認。正答率や間違えた単語をチェックして復習に役立てましょう。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="テスト結果 — Mistap" />
      <meta property="og:description" content="テスト結果を確認して、効率的に復習しましょう。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="テスト結果 — Mistap" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
