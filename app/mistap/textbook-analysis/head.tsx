const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistap.app';

export default function Head() {
  const url = `${siteUrl}/textbook-analysis`;
  return (
    <>
  <title>Mistap | ターゲット1900・システム英単語 小テストアプリ</title>
  <meta name="description" content="『ターゲット1900』『システム英単語（シス単）』に対応した無料の英単語小テストWebアプリ「Mistap」。アプリのインストール不要ですぐに小テストを開始できます。「ターゲット1900」や「システム英単語」の暗記・復習に最適です。" />
      <link rel="canonical" href={url} />

  <meta property="og:title" content="Mistap | ターゲット1900・システム英単語 小テストアプリ" />
  <meta property="og:description" content="『ターゲット1900』『システム英単語（シス単）』に対応した無料の英単語小テストWebアプリ「Mistap」。アプリのインストール不要ですぐに小テストを開始できます。" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${siteUrl}/mistap-logo.png`} />

      <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Mistap | ターゲット1900・システム英単語 小テストアプリ" />
  <meta name="twitter:description" content="『ターゲット1900』『システム英単語（シス単）』に対応した無料の英単語小テストWebアプリ「Mistap」。アプリのインストール不要ですぐに小テストを開始できます。" />
      <meta name="twitter:image" content={`${siteUrl}/mistap-logo.png`} />
    </>
  );
}
