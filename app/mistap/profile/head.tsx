const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/profile`;
  return (
    <>
      <title>プロフィール — Mistap</title>
      <meta name="description" content="Mistapのアカウント情報を確認・編集できます。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="プロフィール — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
