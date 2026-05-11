import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, CheckCircle2, GraduationCap, LibraryBig } from 'lucide-react';

type TextbookItem = {
    name: string;
    href: string;
};

type TextbookGroup = {
    title: string;
    description: string;
    icon: typeof BookOpen;
    accentClassName: string;
    items: TextbookItem[];
};

const textbookGroups: TextbookGroup[] = [
    {
        title: '中学英語・基礎',
        description: '教科書単語から基礎単語、動詞変化まで対応',
        icon: BookOpen,
        accentClassName: 'text-blue-600 bg-blue-50',
        items: [
            { name: 'New Horizon', href: '/mistap/textbook/new-horizon' },
            { name: 'New Crown', href: '/mistap/textbook/new-crown' },
            { name: 'ターゲット1800', href: '/mistap/textbook/target-1800' },
            { name: 'ターゲット1800(5訂版)', href: '/mistap/textbook/target-1800-v5' },
            { name: '過去形', href: '/mistap/textbook/past-tense' },
            { name: '過去形、過去分詞形', href: '/mistap/textbook/past-participle' },
            { name: '絶対覚える英単語150', href: '/mistap/textbook/absolute-150' },
        ],
    },
    {
        title: '大学受験・高校英語',
        description: '主要な英単語帳を範囲指定テストで学習',
        icon: GraduationCap,
        accentClassName: 'text-red-600 bg-red-50',
        items: [
            { name: 'LEAP', href: '/mistap/textbook/leap' },
            { name: 'LEAP Basic', href: '/mistap/textbook/leap-basic' },
            { name: '改訂版 必携英単語LEAP', href: '/mistap/textbook/reform-leap' },
            { name: 'ターゲット1200', href: '/mistap/textbook/target-1200' },
            { name: 'ターゲット1400', href: '/mistap/textbook/target-1400' },
            { name: 'ターゲット1900', href: '/mistap/textbook/target-1900' },
            { name: 'システム英単語', href: '/mistap/textbook/system-words' },
            { name: 'システム英単語 Stage5', href: '/mistap/textbook/system-words-stage5' },
            { name: 'Stock3000', href: '/mistap/textbook/stock-3000' },
            { name: 'Stock4500', href: '/mistap/textbook/stock-4500' },
            { name: '速読英単語 必修編［改訂第8版］', href: '/mistap/textbook/sokutan-hisshu-8th' },
            { name: '速読英単語 上級編［改訂第5版］', href: '/mistap/textbook/sokutan-jokyu-5th' },
            { name: 'DUO 3.0例文', href: '/mistap/textbook/duo-30' },
            { name: '改訂版 鉄緑会東大英単語熟語 鉄壁', href: '/mistap/textbook/teppeki' },
        ],
    },
    {
        title: '英検・TOEIC',
        description: '資格試験向けの単語帳にも対応',
        icon: BriefcaseBusiness,
        accentClassName: 'text-purple-600 bg-purple-50',
        items: [
            { name: '英検準2級 でる順パス単 5訂版', href: '/mistap/textbook/eiken-pre2-passtan-5th' },
            { name: '英検2級 でる順パス単 5訂版', href: '/mistap/textbook/eiken-2-passtan-5th' },
            { name: '英検準1級単熟語EX', href: '/mistap/textbook/eiken-pre1-ex' },
            { name: 'TOEIC L&R TEST 出る単特急 金のフレーズ', href: '/mistap/textbook/toeic-gold' },
        ],
    },
    {
        title: '古文単語',
        description: '高校古文の定番単語帳をまとめてテスト',
        icon: LibraryBig,
        accentClassName: 'text-emerald-600 bg-emerald-50',
        items: [
            { name: '読んで見て聞いて覚える 重要古文単語315', href: '/mistap/textbook/kobun-315' },
            { name: 'Key＆Point古文単語330', href: '/mistap/textbook/kobun-330' },
            { name: 'ベストセレクション古文単語325', href: '/mistap/textbook/kobun-325' },
            { name: '理解を深める核心古文単語351', href: '/mistap/textbook/kobun-351' },
            { name: 'マドンナ古文単語230', href: '/mistap/textbook/madonna-kobun-230' },
            { name: 'GROUP30で覚える古文単語600', href: '/mistap/textbook/group30-kobun-600' },
        ],
    },
];

function TextbookCard({ group }: { group: TextbookGroup }) {
    const Icon = group.icon;

    return (
        <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${group.accentClassName}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                    <h4 className="text-lg md:text-xl font-bold text-slate-900">{group.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{group.description}</p>
                </div>
            </div>

            <ul className="space-y-2">
                {group.items.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            prefetch={false}
                            className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm md:text-base text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-500" aria-hidden="true" />
                            <span className="leading-snug">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function TextbooksSection() {
    return (
        <section id="textbook-list" className="py-8 md:py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        対応教材一覧
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 mt-3">
                        使っている教材を選んで、範囲指定の小テストをすぐ作成できます。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {textbookGroups.map((group) => (
                        <TextbookCard key={group.title} group={group} />
                    ))}
                </div>

                <div className="mt-8 md:mt-12 text-center">
                    <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-4">
                        追加してほしい教材があれば、リクエストからお知らせください。
                    </p>
                    <Link
                        href="/mistap/contact"
                        prefetch={false}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-semibold transition-colors"
                    >
                        単語帳リクエスト
                    </Link>
                </div>
            </div>
        </section>
    );
}
