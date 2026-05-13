import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: '英熟語ターゲット1000 5訂版 テスト｜無料小テストアプリ - Mistap',
    description: '英熟語ターゲット1000 5訂版対応の英熟語テスト。入試頻出の1000熟語を、範囲指定で無料小テスト化できます。',
    keywords: [
        '英熟語ターゲット1000 5訂版',
        '英熟語ターゲット1000',
        '英熟語ターゲット1000［5訂版］',
        '英熟語ターゲット',
        'ターゲット1000 英熟語',
        '英熟語ターゲット1000 アプリ',
        '英熟語ターゲット1000 テスト アプリ',
        '英熟語ターゲット1000 熟語テスト',
        '英熟語ターゲット1000 熟語テスト アプリ',
        '英熟語ターゲット1000 小テスト',
        '英熟語ターゲット1000 小テスト アプリ',
        '英熟語ターゲット1000 小テスト メーカー',
        '英熟語ターゲット1000 小テスト ジェネレーター',
        '英熟語 テスト',
        '英熟語 小テスト',
        '大学受験 英熟語',
        '英熟語 テスト 無料',
    ],
    openGraph: {
        title: '英熟語ターゲット1000 5訂版 テスト｜無料小テストアプリ - Mistap',
        description: '英熟語ターゲット1000 5訂版を範囲指定で無料テスト化。入試頻出熟語をでる順で反復できます。',
        url: 'https://edulens.jp/mistap/textbook/idiom-target-1000-5th',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: '英熟語ターゲット1000 5訂版 テスト｜無料小テストアプリ - Mistap',
        description: '英熟語ターゲット1000 5訂版を無料で小テスト化。必要な範囲だけ指定して反復できます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/idiom-target-1000-5th'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function IdiomTarget10005thPage() {
    return (
        <TextbookLPTemplate
            textbookName="英熟語ターゲット1000 5訂版"
            textbookNameJa="英熟語ターゲット1000 5訂版"
            publisherName="旺文社"
            themeColor="orange"
            presetTextbook="英熟語ターゲット1000 5訂版"
            canonicalUrl="https://edulens.jp/mistap/textbook/idiom-target-1000-5th"
            unitLabel="番号"
            audience="senior"
            bookType="wordbook"
            overrideDescriptionSubject="英熟語ターゲット1000 5訂版の入試頻出英熟語"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-orange-600 mb-4 tracking-normal">英熟語ターゲット1000 5訂版に対応</span>
                        入試頻出1000熟語を<br />
                        <span className="text-orange-500">でる順小テストで反復</span>
                    </h1>
                ),
                heroDescription: "英熟語ターゲット1000 5訂版の無料テスト・クイズアプリ。番号範囲を指定して、入試頻出の英熟語を小テスト化できます。共通テストから難関大対策まで、登録不要ですぐに確認できます。",
                testSectionTitle: "英熟語ターゲット1000 5訂版のテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        会員登録なしで、必要な番号範囲だけすぐにテスト化できます。<br />
                        <strong>英熟語ターゲット1000 5訂版</strong> を選んで、入試頻出の熟語を着実に固めてください。
                    </p>
                ),
                featuresTitle: "英熟語ターゲット1000を小テストで固める",
                featuresDescription: (
                    <p>
                        Mistapなら、熟語帳を眺めるだけで終わらず、<br className="hidden md:inline" />
                        英熟語ターゲット1000 5訂版の重要表現をテスト形式で反復できます。
                    </p>
                ),
                feature1: {
                    title: "番号範囲で細かく確認",
                    description: "1-100、101-200のように区切って出題可能。学校の小テストや自分の復習計画に合わせて進められます。"
                },
                feature2: {
                    title: "でる順の抜けを見つける",
                    description: "入試頻出順の熟語をテスト形式で確認。覚えたつもりの表現や意味の取り違えを見つけやすくなります。"
                },
                feature3: {
                    title: "スマホで短時間復習",
                    description: "通学中や寝る前の数分でも扱いやすい設計。英熟語の反復を毎日の学習に組み込みやすくします。"
                }
            }}
        />
    );
}
