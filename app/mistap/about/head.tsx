const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/about`;
  return (
    <>
      <title>Mistapについて — 効率的な英単語学習</title>
      <meta name="description" content="Mistapは、間違えた単語を効率的に復習できる無料の英単語テストアプリです。ターゲットやシステム英単語に対応しています。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="Mistapについて — 効率的な英単語学習" />
      <meta property="og:description" content="間違えた単語を自動記録し、効率的に復習できる無料学習システム。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Mistapについて" />
      <meta name="twitter:description" content="効率的な英単語学習をサポートするMistapの特徴を紹介します。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
