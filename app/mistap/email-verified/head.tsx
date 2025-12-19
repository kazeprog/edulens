const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/email-verified`;
  return (
    <>
      <title>メール確認完了 — Mistap</title>
      <meta name="description" content="メールアドレスの確認が完了しました。ログインして学習を再開しましょう。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="メール確認完了 — Mistap" />
      <meta property="og:description" content="メール確認が完了しました。ログインして学習を始めましょう。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="メール確認完了 — Mistap" />
      <meta name="twitter:description" content="メール確認が完了しました。ログインして学習を始めましょう。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
