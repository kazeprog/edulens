import type { Metadata } from 'next';
import TextbookLPTemplate from '@/components/mistap/TextbookLPTemplate';

export const dynamic = "force-static";
export const metadata: Metadata = {
    title: '速読英単語 必修編［改訂第8版］単語テスト｜大学受験英単語を無料で演習',
    description: '速読英単語 必修編［改訂第8版］対応の無料英単語テスト。範囲を指定して大学受験の必修語彙を小テスト形式で効率よく復習できます。',
    keywords: [
        '速読英単語 必修編',
        '速読英単語 必修編 改訂第8版',
        '速読英単語　必修編 ［改訂第８版］',
        '速単必修',
        '速単 必修編',
        '速読英単語 必修編 アプリ',
        '速読英単語 必修編 テスト アプリ',
        '速読英単語 必修編 単語テスト',
        '速読英単語 必修編 単語テスト アプリ',
        '速読英単語 必修編 小テスト',
        '速読英単語 必修編 小テスト アプリ',
        '速読英単語 必修編 小テスト メーカー',
        '速読英単語 必修編 小テスト ジェネレーター',
        '大学受験 英単語',
        '大学受験 英単語 テスト',
    ],
    openGraph: {
        title: '速読英単語 必修編［改訂第8版］単語テスト｜大学受験英単語を無料で演習',
        description: '速読英単語 必修編［改訂第8版］の単語を無料でテスト化。範囲指定と反復で受験語彙を着実に定着させられます。',
        url: 'https://edulens.jp/mistap/textbook/sokutan-hisshu-8th',
        type: 'website',
        siteName: 'Mistap 英単語テスト',
        images: ['/mistap-icon-v2.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '速読英単語 必修編［改訂第8版］単語テスト｜大学受験英単語を無料で演習',
        description: '速読英単語 必修編［改訂第8版］を範囲指定で小テスト化。スマホでも手早く復習できます。',
        images: ['/mistap-icon-v2.png'],
    },
    alternates: {
        canonical: 'https://edulens.jp/mistap/textbook/sokutan-hisshu-8th'
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function SokutanHisshu8thPage() {
    return (
        <TextbookLPTemplate
            textbookName="Sokutan Essential"
            textbookNameJa="速読英単語　必修編 ［改訂第８版］"
            publisherName="Z会"
            themeColor="blue"
            presetTextbook="速読英単語　必修編 ［改訂第８版］"
            canonicalUrl="https://edulens.jp/mistap/textbook/sokutan-hisshu-8th"
            unitLabel="Range"
            audience="senior"
            bookType="wordbook"
            seoSettings={{
                heroTitle: (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight">
                        <span className="block text-xl md:text-2xl font-bold text-blue-600 mb-4 tracking-normal">速読英単語　必修編 ［改訂第８版］対応</span>
                        受験必修の英単語を<br />
                        <span className="text-blue-500">小テストで効率よく定着</span>
                    </h1>
                ),
                heroDescription: "速読英単語　必修編 ［改訂第８版］の単語データを使って、範囲指定テストを作成できます。長文読解と大学受験を支える必修語彙を、登録不要でテンポよく確認できます。",
                testSectionTitle: "速読英単語 必修編のテストを無料で作成",
                testSectionDescription: (
                    <p>
                        1-100、101-200のように必要な範囲だけ切り出して出題できます。<br />
                        <strong>速読英単語　必修編 ［改訂第８版］</strong> を選んで、受験必修語彙を反復してください。
                    </p>
                ),
                featuresTitle: "速読英単語 必修編を反復しやすくする",
                featuresDescription: (
                    <p>
                        Mistapなら、読んで覚えるだけでなく、<br className="hidden md:inline" />
                        テスト形式で思い出す練習まで一気に回せます。
                    </p>
                ),
                feature1: {
                    title: "範囲指定で小分けに確認",
                    description: "進度や学校の小テスト範囲に合わせて、必要な単語番号だけを切り出して練習できます。"
                },
                feature2: {
                    title: "必修語彙の抜け漏れを発見",
                    description: "間違えた単語をその場で把握し、苦手語彙を重点的に復習しやすくします。"
                },
                feature3: {
                    title: "スマホで短時間復習",
                    description: "通学中や休憩時間でも、速読英単語 必修編の語彙をテンポよく確認できます。"
                }
            }}
        />
    );
}
