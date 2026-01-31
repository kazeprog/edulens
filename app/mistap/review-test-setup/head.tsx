const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/review-test-setup`;
  return (
    <>
      <title>復習テスト設定 — Mistap</title>
      <meta name="description" content="間違えた単語から自分だけの復習テストを作成します。効率的に弱点を克服しましょう。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="復習テスト設定 — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
