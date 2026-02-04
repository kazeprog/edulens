const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/goals`;
  return (
    <>
      <title>学習目標 — Mistap</title>
      <meta name="description" content="毎日の学習目標を設定して、計画的に単語学習を進めましょう。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="学習目標 — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
