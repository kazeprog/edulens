import { Metadata } from 'next';
import Link from 'next/link';
import Background from "@/components/mistap/Background";
import MistapFooter from "@/components/mistap/Footer";

// ---------------------------------------------
// 1. 教材データの定義（「テストアプリ」として再定義）
// ---------------------------------------------
const BOOKS: Record<string, { title: string; subTitle: string; desc: string; keywords: string[]; selectedText: string }> = {
    'target-1900': {
        title: 'ターゲット1900対応 Webテスト',
        subTitle: 'Webで即・実力診断。',
        desc: 'ターゲット1900の暗記度をスマホでチェック。「覚えているか・いないか」を瞬時に判定する高速テストで、Sectionごとの定着度を確認しよう。',
        keywords: ['ターゲット1900', '単語テスト', 'アプリ', '小テスト', '確認'],
        selectedText: 'ターゲット1900',
    },
    'systan': {
        title: 'システム英単語対応 確認テスト',
        subTitle: '通学中に「シス単」全範囲をテスト。',
        desc: 'システム英単語（シス単）対応の無料テストアプリ。赤シートで隠すよりも速く、正確に。間違えた単語だけを自動で集めて「復習テスト」が作れます。',
        keywords: ['システム英単語', 'シス単', 'テスト', 'アプリ', 'Webテスト'],
        selectedText: 'システム英単語',
    },
    'kobun-315': {
        title: '重要古文単語315対応 テスト',
        subTitle: '古文単語の「小テスト」対策に。',
        desc: '重要古文単語315の見出し語をWebでテスト。意味が出てこない単語をタップするだけで、試験直前の総チェックが完了します。',
        keywords: ['重要古文単語315', '古文単語', 'テスト', '確認', 'アプリ'],
        selectedText: '重要古文単語315',
    },
    'duo-30': {
        title: 'DUO 3.0対応 暗記テスト',
        subTitle: '例文の単語、本当に覚えてる？',
        desc: 'DUO 3.0掲載語彙の定着度テスト。通勤・通学のスキマ時間を使って、自分の記憶漏れをWebアプリで診断できます。',
        keywords: ['DUO3.0', 'テスト', 'アプリ', '復習', '英語'],
        selectedText: 'DUO 3.0',
    },
    'leap': {
        title: 'LEAP対応 単語テスト',
        subTitle: 'LEAPの暗記状況をすぐチェック。',
        desc: 'LEAP（リープ）対応の無料単語テスト。範囲を指定してテストを作成し、間違えた単語だけを効率よく復習できます。',
        keywords: ['LEAP', 'リープ', '単語テスト', 'アプリ', '英語'],
        selectedText: 'LEAP',
    },
    'stock-4500': {
        title: '速読英単語 必修編対応 テスト',
        subTitle: '速単の定着度をチェック。',
        desc: '速読英単語 必修編の単語をWebでテスト。長文読解に必要な語彙力を、スキマ時間で効率的に確認できます。',
        keywords: ['速読英単語', '必修編', 'テスト', 'アプリ', '英語'],
        selectedText: '速読英単語 必修編',
    },
    'toeic-gold': {
        title: 'TOEIC L&R 金のフレーズ対応 テスト',
        subTitle: 'TOEICスコアアップの近道。',
        desc: '金のフレーズ対応の無料テスト。TOEIC頻出単語の暗記状況を瞬時にチェックし、弱点を効率的に克服しましょう。',
        keywords: ['TOEIC', '金のフレーズ', 'テスト', 'アプリ', '英語'],
        selectedText: '金のフレーズ',
    },
    'passtan': {
        title: 'パス単対応 テスト',
        subTitle: '英検対策の定番をWebでテスト。',
        desc: 'でる順パス単対応の無料テストアプリ。英検の級別に単語をテストし、合格に必要な語彙力を効率的に身につけましょう。',
        keywords: ['パス単', '英検', 'テスト', 'アプリ', '英語'],
        selectedText: 'パス単',
    },
};

// ---------------------------------------------
// 2. 静的パスの生成 (SSG)
// ---------------------------------------------
export async function generateStaticParams() {
    return Object.keys(BOOKS).map((slug) => ({
        slug: slug,
    }));
}

// ---------------------------------------------
// 3. メタデータの動的生成 (SEO: 「テスト」を強調)
// ---------------------------------------------
type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const book = BOOKS[slug];

    if (!book) return { title: 'ページが見つかりません' };

    return {
        title: `${book.title}（無料アプリ）| Mistap`,
        description: `【登録不要】${book.title}ができる無料アプリ。${book.desc} インストール不要で今すぐ実力を試せます。`,
        openGraph: {
            title: `${book.title} | Mistap`,
            description: book.subTitle,
            url: `https://edulens.jp/mistap/books/${slug}`,
            images: [
                {
                    url: '/MistapLP.png',
                    width: 1200,
                    height: 630,
                    alt: book.title,
                },
            ],
        },
        keywords: book.keywords,
        alternates: {
            canonical: `https://edulens.jp/mistap/books/${slug}`,
        },
    };
}

// ---------------------------------------------
// 4. ページコンポーネント本体
// ---------------------------------------------
export default async function BookLP({ params }: PageProps) {
    const { slug } = await params;
    const book = BOOKS[slug];

    if (!book) {
        return <div className="p-10 text-center text-white">教材データが見つかりません。</div>;
    }

    return (
        <Background>
            <div className="min-h-screen flex flex-col">

                {/* ヘッダー */}
                <header className="pt-6 pb-4">
                    <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                        <Link href="/mistap" className="text-white font-bold text-xl hover:opacity-80 transition">
                            Mistap
                        </Link>
                        <Link href="/login?mode=signup&redirect=/mistap/home" className="bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition">
                            無料登録
                        </Link>
                    </div>
                </header>

                <main className="flex-grow">
                    {/* ヒーローセクション */}
                    <section className="py-12 px-4 text-center text-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="inline-block bg-red-500/30 border border-red-400/50 backdrop-blur-md rounded-full px-4 py-1 text-sm mb-6 text-red-100">
                                完全無料・インストール不要
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                                {book.title}<br />
                                <span className="text-yellow-300">{book.subTitle}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                                {book.desc}
                            </p>

                            {/* アクションボタン */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href={`/mistap/test-setup?selectedText=${encodeURIComponent(book.selectedText)}`}
                                    className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-yellow-900 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 hover:scale-105 transition transform"
                                >
                                    今すぐテストする（無料）
                                </Link>
                                <Link
                                    href="/mistap"
                                    className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition"
                                >
                                    トップページへ
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 機能解説 */}
                    <section className="py-12 bg-white/95 backdrop-blur-sm rounded-t-3xl text-gray-800">
                        <div className="max-w-4xl mx-auto px-4">
                            <h2 className="text-2xl font-bold text-center mb-10">
                                <span className="text-red-600">Mistap</span>のテスト方式
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="font-bold text-lg mb-2">高速判定テスト</h3>
                                    <p className="text-sm text-gray-600">「分かる・分からない」を瞬時にジャッジ。4択問題よりもスピーディに全範囲を網羅できます。</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h3 className="font-bold text-lg mb-2">自動採点・記録</h3>
                                    <p className="text-sm text-gray-600">テスト結果は自動保存。間違えた単語（弱点）だけがリストに残ります。</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                    <div className="text-4xl mb-4">🔄</div>
                                    <h3 className="font-bold text-lg mb-2">再テスト機能</h3>
                                    <p className="text-sm text-gray-600">間違えた単語だけで「再テスト」が可能。満点になるまで何度でも挑戦できます。</p>
                                </div>
                            </div>

                            {/* SEO対策テキスト */}
                            <div className="prose prose-red mx-auto bg-red-50 p-6 rounded-lg text-sm text-gray-700">
                                <h3 className="text-base font-bold text-red-800 mb-2">{book.title}の学習に</h3>
                                <p>
                                    学校の小テストや定期テスト対策に使える、<strong>{book.title}</strong>対応のWebアプリです。
                                    アプリのインストールや面倒な登録は不要。ブラウザを開けばすぐにテストを開始できます。
                                    通学時間や試験直前の5分間を使って、単語の実力をチェックしましょう。
                                </p>
                            </div>

                            {/* 他の教材へのリンク */}
                            <div className="mt-12 text-center">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">他の教材もテストできます</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {Object.entries(BOOKS).filter(([key]) => key !== slug).slice(0, 4).map(([key, value]) => (
                                        <Link
                                            key={key}
                                            href={`/mistap/books/${key}`}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                                        >
                                            {value.selectedText}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <MistapFooter />
            </div>
        </Background>
    );
}
