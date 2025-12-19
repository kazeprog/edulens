const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/review-test-setup`;
  return (
    <>
      <title>復習セット — Mistap</title>
      <meta name="description" content="間違えた単語をまとめて復習セットを作成。効率的に弱点を克服しましょう。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="復習セット — Mistap" />
      <meta property="og:description" content="間違えた単語で復習セットを作成して、効率よく学習を進めます。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="復習セット — Mistap" />
      <meta name="twitter:description" content="復習セットを作って苦手単語を重点的に学習しましょう。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
