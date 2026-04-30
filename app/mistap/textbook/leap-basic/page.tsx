import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: 'LEAP Basic テスト｜無料小テストアプリ - Mistap',
    description: 'LEAP Basic対応の英単語テスト。基礎1400語を無料で小テスト化でき、共通テスト前の語彙固めや高校英語の土台作りに役立ちます。',
    keywords: [
        'LEAP Basic',
        'LEAP Basic 英単語',
        'LEAP Basic 単語テスト',
        'LEAP Basic 小テスト',
        'LEAP Basic アプリ',
        'LEAP Basic 無料',
        'LEAP Basic 1400',
        'LEAP 基礎',
        '高校英語 単語テスト',
        '共通テスト 英単語',
        '英単語 テスト 無料',
        '英単語 小テスト 作成',
    ],
    openGraph: {
        title: 'LEAP Basic テスト｜無料小テストアプリ - Mistap',
        description: 'LEAP Basicの基礎1400語を無料でテスト。高校英語の土台作りや共通テスト対策の最初の1冊に。 ',
        url: 'https://edulens.jp/mistap/textbook/leap-basic',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LEAP Basic テスト｜無料小テストアプリ - Mistap',
        description: 'LEAP Basicの基礎1400語を無料で小テスト化。英単語の初周や共通テスト前の語彙固めに使えます。',
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/leap-basic'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function LeapBasicPage() {
    return (
        <TextbookLPTemplate
            textbookName="LEAP Basic"
            textbookNameJa="LEAP Basic"
            publisherName="数研出版"
            themeColor="emerald"
            presetTextbook="LEAP Basic"
            canonicalUrl="https://edulens.jp/mistap/textbook/leap-basic"
            unitLabel="Range"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-emerald-600 mb-4 tracking-normal">LEAP Basic 基礎1400語に完全対応</span>
                        高校英語の土台を<br />
                        <span className="text-emerald-500">小テストで着実に定着</span>
                    </h1>
                ),
                heroDescription: "LEAP Basicの無料テスト・クイズアプリ。基礎1400語を範囲指定して小テスト化できるので、単語の初周学習や共通テスト前の総復習にぴったりです。登録不要で今すぐ使えます。",
                testSectionTitle: "LEAP Basicのテストを今すぐ作成",
                testSectionDescription: (
                    <p>
                        会員登録なしで、必要な範囲だけすぐにテスト化できます。<br />
                        <strong>LEAP Basic</strong> を選んで、1語ずつ着実に定着させてください。
                    </p>
                ),
                featuresTitle: "LEAP Basicで基礎語彙を固める",
                featuresDescription: (
                    <p>
                        Mistapなら、ただ眺めるだけで終わらず、<br className="hidden md:inline" />
                        LEAP Basicの基礎1400語をテスト形式で反復できます。
                    </p>
                ),
                feature1: {
                    title: "範囲指定で効率学習",
                    description: "1-100、101-200のように区切って出題可能。授業進度や自分の学習計画に合わせて柔軟に復習できます。"
                },
                feature2: {
                    title: "基礎語彙の抜け漏れを防ぐ",
                    description: "間違えた単語は自動で蓄積。基礎だからこそ見逃したくない語を、あとから重点復習できます。"
                },
                feature3: {
                    title: "スマホで毎日続けやすい",
                    description: "短時間でも回せる設計なので、通学中や寝る前の数分でLEAP Basicを着実に進められます。"
                }
            }}
        />
    );
}
