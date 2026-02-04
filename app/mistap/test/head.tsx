const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/test`;
  return (
    <>
      <title>テスト実施中 — Mistap</title>
      <meta name="description" content="英単語テストを実施しています。最後まで集中して取り組みましょう。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="テスト実施中 — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
