const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/contact`;
  return (
    <>
      <title>お問い合わせ — Mistap</title>
      <meta name="description" content="Mistapに関するお問い合わせはこちらから。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="お問い合わせ — Mistap" />
      <meta property="og:description" content="Mistapに関するお問い合わせ・ご意見はこちらからお寄せください。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="お問い合わせ — Mistap" />
      <meta name="twitter:description" content="Mistapに関するお問い合わせはこちらから。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
