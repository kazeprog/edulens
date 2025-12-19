const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/profile`;
  return (
    <>
      <title>プロフィール — Mistap</title>
      <meta name="description" content="プロフィールを編集して、学年やニックネームを設定しましょう。学習履歴と連携します。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="プロフィール — Mistap" />
      <meta property="og:description" content="学年やニックネームを設定して、あなたに合ったテストを作成しましょう。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="プロフィール — Mistap" />
      <meta name="twitter:description" content="プロフィール設定ページです。学年や名前を登録してください。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
