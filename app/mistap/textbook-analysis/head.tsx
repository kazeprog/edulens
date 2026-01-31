const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/textbook-analysis`;
  return (
    <>
      <title>教材別分析 — Mistap</title>
      <meta name="description" content="教材ごとの学習進捗や正答率を詳細に分析します。苦手な範囲を視覚化しましょう。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="教材別分析 — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
