const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/contact`;
  return (
    <>
      <title>お問い合わせ — Mistap</title>
      <meta name="description" content="Mistapへのお問い合わせはこちら。ご要望・不具合報告・ご相談をお送りください。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="お問い合わせ — Mistap" />
      <meta property="og:description" content="Mistapへのお問い合わせフォームページです。ご要望や問題報告はこちらから。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="お問い合わせ — Mistap" />
      <meta name="twitter:description" content="Mistapへのお問い合わせはこちらから。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
