const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/email-verified`;
  return (
    <>
      <title>メール認証完了 — Mistap</title>
      <meta name="description" content="メール認証が完了しました。Mistapですべての機能をご利用いただけます。" />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:title" content="メール認証完了 — Mistap" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
