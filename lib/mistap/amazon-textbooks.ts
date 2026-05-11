export type AmazonTextbookEntry = {
  title: string;
  searchQuery: string;
  asin?: string;
  isbn13?: string;
  publisher?: string;
  edition?: string;
  isPurchasable?: boolean;
};

export type AmazonTextbookLinkResult = {
  url: string;
  label: string;
  isProductPage: boolean;
  asin?: string;
};

// Amazon.co.jpの紙書籍はASINがISBN-10と一致することが多い。
// 版違いの事故を避けるため、確認できた教材だけASINを持たせる。
// Mistap独自データや文法カテゴリは商品ではないため、Amazonボタン自体を出さない。
export const AMAZON_TEXTBOOKS = {
  target1200: {
    title: '英単語ターゲット1200 改訂版',
    searchQuery: '英単語ターゲット1200 改訂版',
    asin: '4010346485',
    isbn13: '9784010346488',
    publisher: '旺文社',
    edition: '改訂版',
  },
  target1400: {
    title: '英単語ターゲット1400 5訂版',
    searchQuery: '英単語ターゲット1400 5訂版',
    asin: '4010346477',
    isbn13: '9784010346471',
    publisher: '旺文社',
    edition: '5訂版',
  },
  target1900: {
    title: '英単語ターゲット1900 6訂版',
    searchQuery: '英単語ターゲット1900 6訂版',
    asin: '4010346469',
    isbn13: '9784010346464',
    publisher: '旺文社',
    edition: '6訂版',
  },
  target1800: {
    title: '高校入試 でる順ターゲット 中学英単語1800 四訂版',
    searchQuery: '高校入試 でる順ターゲット 中学英単語1800 四訂版',
    asin: '4010217995',
    isbn13: '9784010217993',
    publisher: '旺文社',
    edition: '四訂版',
  },
  target1800V5: {
    title: '高校入試 でる順ターゲット 中学英単語1800 五訂版',
    searchQuery: '高校入試 でる順ターゲット 中学英単語1800 五訂版',
    asin: '4010222646',
    isbn13: '9784010222645',
    publisher: '旺文社',
    edition: '五訂版',
  },
  systemWords: {
    title: 'システム英単語 5訂版',
    searchQuery: 'システム英単語 5訂版',
    asin: '4796111379',
    isbn13: '9784796111379',
    publisher: '駿台文庫',
    edition: '5訂版',
  },
  leap: {
    title: '必携英単語LEAP',
    searchQuery: '必携英単語LEAP',
    asin: '4410144227',
    isbn13: '9784410144226',
    publisher: '数研出版',
  },
  reformLeap: {
    title: '改訂版 必携 英単語 LEAP',
    searchQuery: '改訂版 必携 英単語 LEAP',
    asin: '4410144235',
    isbn13: '9784410144233',
    publisher: '数研出版',
    edition: '改訂版',
  },
  leapBasic: {
    title: '必携 英単語 LEAP Basic',
    searchQuery: '必携 英単語 LEAP Basic',
    asin: '4410144324',
    isbn13: '9784410144325',
    publisher: '数研出版',
  },
  reformLeapBasic: {
    title: '改訂版 必携 英単語 LEAP Basic',
    searchQuery: '改訂版 必携 英単語 LEAP Basic',
    asin: '4410144332',
    isbn13: '9784410144332',
    publisher: '数研出版',
    edition: '改訂版',
  },
  stock3000: {
    title: '英単語Stock3000',
    searchQuery: '英単語Stock3000',
    asin: '4578271412',
    isbn13: '9784578271413',
    publisher: '文英堂',
  },
  stock4500: {
    title: '英単語Stock4500',
    searchQuery: '英単語Stock4500',
    asin: '4578271420',
    isbn13: '9784578271420',
    publisher: '文英堂',
  },
  duo30: {
    title: 'DUO 3.0',
    searchQuery: 'DUO 3.0',
    asin: '4900790052',
    isbn13: '9784900790056',
    publisher: 'アイシーピー',
  },
  sokutanHisshu8: {
    title: '速読英単語 必修編 改訂第8版',
    searchQuery: '速読英単語 必修編 改訂第8版',
    asin: '4865316426',
    isbn13: '9784865316421',
    publisher: 'Z会',
    edition: '改訂第8版',
  },
  sokutanJokyu5: {
    title: '速読英単語 上級編 改訂第5版',
    searchQuery: '速読英単語 上級編 改訂第5版',
    asin: '4865315217',
    isbn13: '9784865315219',
    publisher: 'Z会',
    edition: '改訂第5版',
  },
  teppeki: {
    title: '改訂版 鉄緑会東大英単語熟語 鉄壁',
    searchQuery: '改訂版 鉄緑会東大英単語熟語 鉄壁',
    asin: '404604411X',
    isbn13: '9784046044112',
    publisher: 'KADOKAWA',
    edition: '改訂版',
  },
  eikenPre2Passtan5: {
    title: '英検準2級 でる順パス単 5訂版',
    searchQuery: '英検準2級 でる順パス単 5訂版',
    asin: '4010949856',
    isbn13: '9784010949856',
    publisher: '旺文社',
    edition: '5訂版',
  },
  eiken2Passtan5: {
    title: '英検2級 でる順パス単 5訂版',
    searchQuery: '英検2級 でる順パス単 5訂版',
    asin: '4010949848',
    isbn13: '9784010949849',
    publisher: '旺文社',
    edition: '5訂版',
  },
  eikenPre1Ex: {
    title: '出る順で最短合格! 英検準1級単熟語EX 第2版',
    searchQuery: '英検準1級単熟語EX 第2版',
    asin: '4789018504',
    isbn13: '9784789018500',
    publisher: 'ジャパンタイムズ出版',
    edition: '第2版',
  },
  toeicGold: {
    title: 'TOEIC L&R TEST 出る単特急 金のフレーズ',
    searchQuery: 'TOEIC L&R TEST 出る単特急 金のフレーズ',
    asin: '4023315680',
    isbn13: '9784023315686',
    publisher: '朝日新聞出版',
  },
  toeicSilver: {
    title: 'TOEIC L&R TEST 出る単特急 銀のフレーズ',
    searchQuery: 'TOEIC L&R TEST 出る単特急 銀のフレーズ',
    asin: '4023316849',
    isbn13: '9784023316843',
    publisher: '朝日新聞出版',
  },
  kobun315: {
    title: '読んで見て聞いて覚える 重要古文単語315 四訂版',
    searchQuery: '読んで見て聞いて覚える 重要古文単語315 四訂版',
    asin: '4342353091',
    isbn13: '9784342353093',
    publisher: '桐原書店',
    edition: '四訂版',
  },
  kobun330: {
    title: 'Key & Point 古文単語330',
    searchQuery: 'Key & Point 古文単語330',
    asin: '4868100513',
    isbn13: '9784868100515',
    publisher: 'いいずな書店',
  },
  kobun325: {
    title: '入試対策ベストセレクション 古文単語325',
    searchQuery: '入試対策ベストセレクション 古文単語325',
    asin: '4780512247',
    isbn13: '9784780512243',
    publisher: '尚文出版',
  },
  kobun351: {
    title: '理解を深める核心古文単語351 新版',
    searchQuery: '理解を深める核心古文単語351 新版',
    asin: '4780512190',
    isbn13: '9784780512199',
    publisher: '尚文出版',
    edition: '新版',
  },
  shinKobun336: {
    title: '大学入試 新古文単語336',
    searchQuery: '大学入試 新古文単語336',
    asin: '4578271994',
    isbn13: '9784578271994',
    publisher: '文英堂',
  },
  madonnaKobun230: {
    title: 'マドンナ古文単語230 パーフェクト版',
    searchQuery: 'マドンナ古文単語230 パーフェクト版',
    asin: '4053057590',
    isbn13: '9784053057594',
    publisher: 'Gakken',
    edition: 'パーフェクト版',
  },
  group30Kobun600: {
    title: 'GROUP30で覚える古文単語600',
    searchQuery: 'GROUP30で覚える古文単語600',
    asin: '4875687915',
    isbn13: '9784875687917',
    publisher: '語学春秋社',
  },
  newHorizon: {
    title: 'NEW HORIZON',
    searchQuery: 'NEW HORIZON',
    publisher: '東京書籍',
    isPurchasable: false,
  },
  newCrown: {
    title: 'NEW CROWN',
    searchQuery: 'NEW CROWN',
    publisher: '三省堂',
    isPurchasable: false,
  },
  absolute150: {
    title: '絶対覚える英単語150',
    searchQuery: '絶対覚える英単語150',
    isPurchasable: false,
  },
  pastTense: {
    title: '不規則動詞の過去形',
    searchQuery: '不規則動詞の過去形',
    isPurchasable: false,
  },
  pastParticiple: {
    title: '不規則動詞の過去形・過去分詞形',
    searchQuery: '不規則動詞の過去形・過去分詞形',
    isPurchasable: false,
  },
} as const satisfies Record<string, AmazonTextbookEntry>;

export type AmazonTextbookKey = keyof typeof AMAZON_TEXTBOOKS;

const AMAZON_TEXTBOOK_ALIASES: Record<string, AmazonTextbookKey> = {
  ターゲット1200: 'target1200',
  英単語ターゲット1200: 'target1200',
  '英単語ターゲット1200 改訂版': 'target1200',
  ターゲット1400: 'target1400',
  英単語ターゲット1400: 'target1400',
  '英単語ターゲット1400 5訂版': 'target1400',
  ターゲット1900: 'target1900',
  英単語ターゲット1900: 'target1900',
  '英単語ターゲット1900 6訂版': 'target1900',
  ターゲット1800: 'target1800',
  'ターゲット1800(5訂版)': 'target1800V5',
  'ターゲット1800 5訂版': 'target1800V5',
  '中学英単語ターゲット1800': 'target1800',
  '高校入試 でる順ターゲット 中学英単語1800 五訂版': 'target1800V5',
  システム英単語: 'systemWords',
  シス単: 'systemWords',
  'システム英単語 Stage5': 'systemWords',
  LEAP: 'leap',
  '必携英単語LEAP': 'leap',
  '必携英単語 LEAP': 'leap',
  '改訂版 必携英単語LEAP': 'reformLeap',
  '改訂版 必携 英単語 LEAP': 'reformLeap',
  'LEAP Basic': 'leapBasic',
  'LEAP Basic 英単語': 'leapBasic',
  '必携 英単語 LEAP Basic': 'leapBasic',
  '改訂版 必携 英単語 LEAP Basic': 'reformLeapBasic',
  Stock3000: 'stock3000',
  英単語Stock3000: 'stock3000',
  '英単語 Stock3000': 'stock3000',
  Stock4500: 'stock4500',
  英単語Stock4500: 'stock4500',
  '英単語 Stock4500': 'stock4500',
  'DUO 3.0': 'duo30',
  DUO30: 'duo30',
  '速読英単語 必修編': 'sokutanHisshu8',
  '速読英単語 必修編 改訂第8版': 'sokutanHisshu8',
  '速読英単語　必修編 ［改訂第８版］': 'sokutanHisshu8',
  '速読英単語 上級編': 'sokutanJokyu5',
  '速読英単語 上級編 改訂第5版': 'sokutanJokyu5',
  '速読英単語　上級編［改訂第５版］': 'sokutanJokyu5',
  鉄壁: 'teppeki',
  '鉄緑会 東大英単語熟語 鉄壁': 'teppeki',
  '改訂版 鉄緑会東大英単語熟語 鉄壁': 'teppeki',
  '英検準2級 でる順パス単 5訂版': 'eikenPre2Passtan5',
  '英検2級 でる順パス単': 'eiken2Passtan5',
  '英検2級 でる順パス単 5訂版': 'eiken2Passtan5',
  英検準1級単熟語EX: 'eikenPre1Ex',
  '英検準1級 単熟語EX': 'eikenPre1Ex',
  '英検準1級単熟語EX 第2版': 'eikenPre1Ex',
  'TOEIC L&R 金のフレーズ': 'toeicGold',
  'TOEIC金のフレーズ': 'toeicGold',
  'TOEIC L&R TEST 出る単特急 金のフレーズ': 'toeicGold',
  金のフレーズ: 'toeicGold',
  金フレ: 'toeicGold',
  'TOEIC L&R 銀のフレーズ': 'toeicSilver',
  'TOEIC L&R TEST 出る単特急 銀のフレーズ': 'toeicSilver',
  TOEIC銀のフレーズ: 'toeicSilver',
  銀のフレーズ: 'toeicSilver',
  銀フレ: 'toeicSilver',
  重要古文単語315: 'kobun315',
  '読んで見て聞いて覚える 重要古文単語315': 'kobun315',
  '読んで見て聞いて覚える 重要古文単語315 四訂版': 'kobun315',
  'Key & Point 古文単語330': 'kobun330',
  'Key＆Point古文単語330': 'kobun330',
  'Key&Point古文単語330': 'kobun330',
  'ベストセレクション 古文単語325': 'kobun325',
  ベストセレクション古文単語325: 'kobun325',
  '入試対策ベストセレクション 古文単語325': 'kobun325',
  理解を深める核心古文単語351: 'kobun351',
  核心古文単語351: 'kobun351',
  '大学入試 新古文単語336': 'shinKobun336',
  新古文単語336: 'shinKobun336',
  古文単語336: 'shinKobun336',
  'マドンナ古文単語': 'madonnaKobun230',
  マドンナ古文単語230: 'madonnaKobun230',
  'マドンナ古文単語230 パーフェクト版': 'madonnaKobun230',
  GROUP30で覚える古文単語600: 'group30Kobun600',
  'GROUP（グループ）30で覚える古文単語600': 'group30Kobun600',
  ニューホライズン: 'newHorizon',
  'NEW HORIZON': 'newHorizon',
  ニュークラウン: 'newCrown',
  'NEW CROWN': 'newCrown',
  絶対覚える英単語150: 'absolute150',
  過去形: 'pastTense',
  不規則動詞の過去形: 'pastTense',
  過去分詞形: 'pastParticiple',
  '過去形、過去分詞形': 'pastParticiple',
  不規則動詞の過去分詞形: 'pastParticiple',
  '不規則動詞の過去形・過去分詞形': 'pastParticiple',
};

function normalizeTextbookName(value: string) {
  return value
    .toLowerCase()
    .replace(/[ \u3000[\]［］()（）・!！]/g, '')
    .replace(/&/g, '＆');
}

const NORMALIZED_AMAZON_TEXTBOOK_ALIASES = Object.fromEntries(
  Object.entries(AMAZON_TEXTBOOK_ALIASES).map(([alias, key]) => [normalizeTextbookName(alias), key])
) as Record<string, AmazonTextbookKey>;

export function resolveAmazonTextbook(textbookName: string): AmazonTextbookEntry | undefined {
  const key =
    AMAZON_TEXTBOOK_ALIASES[textbookName] ??
    NORMALIZED_AMAZON_TEXTBOOK_ALIASES[normalizeTextbookName(textbookName)];

  return key ? AMAZON_TEXTBOOKS[key] : undefined;
}

export function getAmazonTextbookLink({
  textbookName,
  trackingId,
  asin,
  searchQuery,
  displayName,
  allowSearchFallback,
}: {
  textbookName: string;
  trackingId: string;
  asin?: string;
  searchQuery?: string;
  displayName?: string;
  allowSearchFallback?: boolean;
}): AmazonTextbookLinkResult | null {
  const resolved = resolveAmazonTextbook(textbookName);
  const shouldUseSearchFallback = allowSearchFallback ?? true;

  if (resolved?.isPurchasable === false) {
    return null;
  }

  const productAsin = asin ?? resolved?.asin;
  const label = displayName ?? resolved?.title ?? textbookName;

  if (productAsin) {
    return {
      url: `https://www.amazon.co.jp/dp/${productAsin}?tag=${encodeURIComponent(trackingId)}`,
      label,
      isProductPage: true,
      asin: productAsin,
    };
  }

  if (!shouldUseSearchFallback) {
    return null;
  }

  const query = searchQuery ?? resolved?.searchQuery ?? textbookName;

  return {
    url: `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(trackingId)}`,
    label,
    isProductPage: false,
  };
}
