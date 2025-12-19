const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/about`;
  return (
    <>
      <title>About — Mistap</title>
      <meta name="description" content="Mistapの特徴、対応教材、使い方を詳しく紹介します。中学・高校生の英単語学習をサポート。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="About — Mistap" />
      <meta property="og:description" content="Mistapの特徴や使い方、対応教材を紹介します。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About — Mistap" />
      <meta name="twitter:description" content="Mistapの特徴や使い方を紹介します。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
