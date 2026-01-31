const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edulens.jp';

export default function Head() {
  const url = `${siteUrl}/mistap/test-setup`;
  return (
    <>
      <title>テスト作成 — Mistap</title>
      <meta name="description" content="ターゲット1900、システム英単語、教科書などの範囲を選択して、今すぐ英単語テストを作成しましょう。" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content="テスト作成 — Mistap" />
      <meta property="og:description" content="範囲を選択して、自分だけの英単語テストを今すぐ作成。効率的に暗記を進めましょう。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="テスト作成 — Mistap" />
      <meta name="twitter:description" content="ターゲットや教科書の範囲から英単語テストを作成。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
