const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/test`;
  return (
    <>
      <title>テスト実行 — Mistap</title>
      <meta name="description" content="問題に回答して、英単語力をチェック。間違えた単語は復習リストへ自動登録されます。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="テスト実行 — Mistap" />
      <meta property="og:description" content="問題に回答して、英単語力をチェック。復習に活用できます。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="テスト実行 — Mistap" />
      <meta name="twitter:description" content="実際にテストを受けて、英単語の定着度を確認しましょう。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
