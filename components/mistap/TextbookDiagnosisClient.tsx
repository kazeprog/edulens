'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import AmazonTextbookLink from '@/components/mistap/AmazonTextbookLink';

type QuestionId = 'grade' | 'goal' | 'level' | 'style';

type Choice = {
    label: string;
    value: string;
    description: string;
};

type Question = {
    id: QuestionId;
    title: string;
    eyebrow: string;
    choices: Choice[];
};

type Answers = Partial<Record<QuestionId, string>>;

type BookRule = Partial<Record<QuestionId, Record<string, number>>>;

type BookRecommendation = {
    name: string;
    shortName: string;
    amazonQuery: string;
    mistapPath: string;
    levelLabel: string;
    summary: string;
    strategy: string;
    strengths: string[];
    rules: BookRule;
};

const questions: Question[] = [
    {
        id: 'grade',
        eyebrow: 'Question 1',
        title: '今の学習段階は？',
        choices: [
            { label: '中学生', value: 'junior', description: '定期テストや高校入試に向けて基礎語彙を固めたい' },
            { label: '高1', value: 'high1', description: '高校英語の土台を作り始めたい' },
            { label: '高2', value: 'high2', description: '大学受験に向けて本格的に単語帳を回したい' },
            { label: '高3・既卒', value: 'high3', description: '入試本番に向けて完成度を上げたい' },
            { label: '大学生・社会人', value: 'adult', description: '資格試験や英語の学び直しで使いたい' },
        ],
    },
    {
        id: 'goal',
        eyebrow: 'Question 2',
        title: '一番近い目的は？',
        choices: [
            { label: '定期テスト', value: 'regular_exam', description: '学校の小テストや定期テストで点を取りたい' },
            { label: '共通テスト', value: 'common_test', description: '標準から共通テストレベルを安定させたい' },
            { label: '私大・中堅大', value: 'mid_uni', description: '頻出語をテンポよく広く押さえたい' },
            { label: '難関大', value: 'difficult_uni', description: '発展語や多義語まで詰めたい' },
            { label: '英検', value: 'eiken', description: '級別の語彙対策をしたい' },
            { label: 'TOEIC', value: 'toeic', description: 'スコアに直結する頻出表現を覚えたい' },
        ],
    },
    {
        id: 'level',
        eyebrow: 'Question 3',
        title: '今の単語力は？',
        choices: [
            { label: '基礎から不安', value: 'weak', description: '中学語彙や高校初級から確認したい' },
            { label: '学校レベルはOK', value: 'basic', description: '基礎語彙はあるので受験語彙に入りたい' },
            { label: '標準は戦える', value: 'standard', description: '共通テストから私大レベルをさらに固めたい' },
            { label: 'かなり得意', value: 'advanced', description: '難関大や発展語まで攻めたい' },
        ],
    },
    {
        id: 'style',
        eyebrow: 'Question 4',
        title: '覚え方の好みは？',
        choices: [
            { label: '短時間で回したい', value: 'quick', description: '番号順・頻出順でテンポよく反復したい' },
            { label: '例文で覚えたい', value: 'example', description: '使い方や文脈と一緒に定着させたい' },
            { label: 'とにかく網羅したい', value: 'coverage', description: '抜け漏れを減らして安心したい' },
            { label: '長文にもつなげたい', value: 'context', description: '語彙だけでなく読解力にもつなげたい' },
        ],
    },
];

const books: BookRecommendation[] = [
    {
        name: 'ターゲット1200',
        shortName: 'ターゲット1200',
        amazonQuery: '英単語ターゲット1200',
        mistapPath: '/mistap/textbook/target-1200',
        levelLabel: '高校英語の基礎固め',
        summary: '高校初級から共通テストの土台まで、最初の1冊として回しやすい単語帳です。',
        strategy: 'まずは短い範囲で小テストを作り、正答率が安定したら次のSectionへ進みましょう。',
        strengths: ['基礎から始めやすい', '短時間で反復しやすい', '高1・高2の初期に合う'],
        rules: {
            grade: { high1: 5, junior: 2, high2: 2 },
            goal: { regular_exam: 4, common_test: 2 },
            level: { weak: 5, basic: 3 },
            style: { quick: 4 },
        },
    },
    {
        name: 'ターゲット1400',
        shortName: 'ターゲット1400',
        amazonQuery: '英単語ターゲット1400',
        mistapPath: '/mistap/textbook/target-1400',
        levelLabel: '共通テスト・中堅大の土台',
        summary: '基礎から標準レベルまでをテンポよく固めたい人に向いています。',
        strategy: '毎日100語単位でテストし、間違えた単語だけを翌日に復習すると伸びやすいです。',
        strengths: ['標準語彙に入りやすい', '定期テストにも使いやすい', '短期集中と相性が良い'],
        rules: {
            grade: { high1: 3, high2: 4 },
            goal: { regular_exam: 2, common_test: 4, mid_uni: 3 },
            level: { weak: 2, basic: 5, standard: 2 },
            style: { quick: 4, coverage: 2 },
        },
    },
    {
        name: 'ターゲット1900',
        shortName: 'ターゲット1900',
        amazonQuery: '英単語ターゲット1900',
        mistapPath: '/mistap/textbook/target-1900',
        levelLabel: '大学受験の定番',
        summary: '受験頻出語をランク順に広く押さえたい人に向いています。',
        strategy: 'SectionごとにMistapで確認し、間違えた単語だけを復習リストで詰めましょう。',
        strengths: ['頻出順で進めやすい', '受験生の定番', '小テスト化しやすい'],
        rules: {
            grade: { high2: 4, high3: 5 },
            goal: { common_test: 4, mid_uni: 5, difficult_uni: 2 },
            level: { basic: 3, standard: 5 },
            style: { quick: 5, coverage: 3 },
        },
    },
    {
        name: 'システム英単語',
        shortName: 'シス単',
        amazonQuery: 'システム英単語',
        mistapPath: '/mistap/textbook/system-words',
        levelLabel: '共通テストから難関大まで',
        summary: 'ミニマルフレーズで使い方も押さえながら、受験語彙を効率よく固められます。',
        strategy: 'Chapter別にテストし、正答率が下がるChapterを重点的に回すのがおすすめです。',
        strengths: ['受験語彙の軸にしやすい', '多くの高校生に合う', 'Chapter別復習と相性が良い'],
        rules: {
            grade: { high2: 5, high3: 5 },
            goal: { common_test: 5, mid_uni: 4, difficult_uni: 3 },
            level: { basic: 3, standard: 5, advanced: 2 },
            style: { quick: 2, example: 3, coverage: 4 },
        },
    },
    {
        name: 'LEAP Basic',
        shortName: 'LEAP Basic',
        amazonQuery: 'LEAP Basic 英単語',
        mistapPath: '/mistap/textbook/leap-basic',
        levelLabel: '高校基礎の例文型',
        summary: 'LEAPに入る前の基礎固めや、高校英語の最初の1冊として使いやすい教材です。',
        strategy: '例文で確認したあと、Mistapで意味を即答できるかチェックしましょう。',
        strengths: ['基礎を丁寧に固められる', '例文で覚えやすい', '高1に合う'],
        rules: {
            grade: { high1: 5, high2: 2 },
            goal: { regular_exam: 4, common_test: 2 },
            level: { weak: 4, basic: 4 },
            style: { example: 4 },
        },
    },
    {
        name: 'LEAP',
        shortName: 'LEAP',
        amazonQuery: '必携英単語 LEAP',
        mistapPath: '/mistap/textbook/leap',
        levelLabel: '4技能を意識した受験語彙',
        summary: '例文や語法を意識しながら、入試で使える語彙力を作りたい人に向いています。',
        strategy: 'Partごとに小テストを作り、意味だけでなく使い方も思い出す習慣を作りましょう。',
        strengths: ['例文学習と相性が良い', '語法も意識しやすい', '受験語彙を広く固められる'],
        rules: {
            grade: { high2: 4, high3: 4 },
            goal: { common_test: 3, mid_uni: 4, difficult_uni: 3 },
            level: { basic: 3, standard: 5 },
            style: { example: 5, coverage: 2 },
        },
    },
    {
        name: 'Stock3000',
        shortName: 'Stock3000',
        amazonQuery: '英単語 Stock3000',
        mistapPath: '/mistap/textbook/stock-3000',
        levelLabel: '基礎から標準まで',
        summary: '基礎から受験標準までを、まとまりよく進めたい人に合います。',
        strategy: '一度に広く進めすぎず、50から100語単位でテストして定着を確認しましょう。',
        strengths: ['標準語彙に入りやすい', '毎日回しやすい', '高1・高2に合う'],
        rules: {
            grade: { high1: 3, high2: 4 },
            goal: { regular_exam: 3, common_test: 4, mid_uni: 3 },
            level: { weak: 2, basic: 5, standard: 2 },
            style: { quick: 3, coverage: 3 },
        },
    },
    {
        name: 'Stock4500',
        shortName: 'Stock4500',
        amazonQuery: '英単語 Stock4500',
        mistapPath: '/mistap/textbook/stock-4500',
        levelLabel: '標準から発展まで',
        summary: '標準語彙を押さえたあと、発展語まで広げたい人に向いています。',
        strategy: '苦手語だけをMistapで残しながら、発展語を少しずつ積み上げましょう。',
        strengths: ['語彙を広げやすい', '発展レベルに進める', '高2後半から高3に合う'],
        rules: {
            grade: { high2: 3, high3: 4 },
            goal: { mid_uni: 4, difficult_uni: 3 },
            level: { standard: 4, advanced: 3 },
            style: { coverage: 4 },
        },
    },
    {
        name: 'DUO 3.0',
        shortName: 'DUO 3.0',
        amazonQuery: 'DUO 3.0',
        mistapPath: '/mistap/textbook/duo-30',
        levelLabel: '例文で実用語彙',
        summary: '例文で単語と熟語をまとめて覚えたい人に向いています。',
        strategy: '例文を読んでから、Mistapで重要語の意味を即答できるか確認しましょう。',
        strengths: ['例文で覚えられる', '熟語にもつながる', '社会人の学び直しにも合う'],
        rules: {
            grade: { high2: 2, high3: 3, adult: 4 },
            goal: { mid_uni: 2, toeic: 3 },
            level: { basic: 2, standard: 4, advanced: 2 },
            style: { example: 5, context: 4 },
        },
    },
    {
        name: '速読英単語 必修編',
        shortName: '速単 必修編',
        amazonQuery: '速読英単語 必修編 改訂第8版',
        mistapPath: '/mistap/textbook/sokutan-hisshu-8th',
        levelLabel: '長文につながる語彙',
        summary: '語彙学習を長文読解にもつなげたい人に合います。',
        strategy: '英文を読んだあとに、収録語をMistapで確認して抜けをつぶしましょう。',
        strengths: ['文脈で覚えやすい', '読解力にもつながる', '共通テスト対策と相性が良い'],
        rules: {
            grade: { high2: 3, high3: 4 },
            goal: { common_test: 4, mid_uni: 3 },
            level: { basic: 2, standard: 4 },
            style: { context: 5, example: 3 },
        },
    },
    {
        name: '速読英単語 上級編',
        shortName: '速単 上級編',
        amazonQuery: '速読英単語 上級編 改訂第5版',
        mistapPath: '/mistap/textbook/sokutan-jokyu-5th',
        levelLabel: '難関大の読解語彙',
        summary: '難関大レベルの英文と語彙をセットで鍛えたい人向けです。',
        strategy: '長文で出会った語を、Mistapのテストで反射的に思い出せる状態にしましょう。',
        strengths: ['難関大向け', '読解語彙に強い', '文脈型の学習に合う'],
        rules: {
            grade: { high3: 5 },
            goal: { difficult_uni: 5 },
            level: { advanced: 5, standard: 2 },
            style: { context: 5, coverage: 2 },
        },
    },
    {
        name: '鉄壁',
        shortName: '鉄壁',
        amazonQuery: '鉄緑会 東大英単語熟語 鉄壁',
        mistapPath: '/mistap/textbook/teppeki',
        levelLabel: '難関大・最難関大',
        summary: '語源や関連語まで含めて、難関大向けに語彙を深く固めたい人向けです。',
        strategy: '完璧主義になりすぎず、苦手語だけをMistapで残して周回効率を上げましょう。',
        strengths: ['難関大対策に強い', '網羅性が高い', '深く理解しやすい'],
        rules: {
            grade: { high3: 5 },
            goal: { difficult_uni: 5 },
            level: { advanced: 5 },
            style: { coverage: 5 },
        },
    },
    {
        name: '英検2級 でる順パス単',
        shortName: 'パス単2級',
        amazonQuery: '英検2級 でる順パス単 5訂版',
        mistapPath: '/mistap/textbook/eiken-2-passtan-5th',
        levelLabel: '英検2級',
        summary: '英検2級の頻出語を級別に対策したい人向けです。',
        strategy: '頻出度順に進め、間違えた語だけを試験前にまとめて復習しましょう。',
        strengths: ['英検対策に直結', '級別に進めやすい', '頻出語を押さえやすい'],
        rules: {
            grade: { high1: 2, high2: 3, high3: 2, adult: 2 },
            goal: { eiken: 5 },
            level: { basic: 3, standard: 4 },
            style: { quick: 3, coverage: 2 },
        },
    },
    {
        name: '英検準1級単熟語EX',
        shortName: '単熟語EX 準1級',
        amazonQuery: '英検準1級単熟語EX',
        mistapPath: '/mistap/textbook/eiken-pre1-ex',
        levelLabel: '英検準1級',
        summary: '英検準1級レベルの語彙を本格的に増やしたい人向けです。',
        strategy: '一度に詰め込まず、苦手語を残しながら複数回に分けて反復しましょう。',
        strengths: ['英検準1級向け', '発展語彙を増やせる', '単熟語をまとめて対策'],
        rules: {
            grade: { high3: 3, adult: 4 },
            goal: { eiken: 5, difficult_uni: 2 },
            level: { advanced: 5, standard: 2 },
            style: { coverage: 4 },
        },
    },
    {
        name: 'TOEIC L&R 金のフレーズ',
        shortName: '金のフレーズ',
        amazonQuery: 'TOEIC L&R TEST 出る単特急 金のフレーズ',
        mistapPath: '/mistap/textbook/toeic-gold',
        levelLabel: 'TOEIC頻出語',
        summary: 'TOEICのスコアに直結する頻出語・表現を効率よく覚えたい人向けです。',
        strategy: '目標スコア別に進め、反射的に意味が出るまで小テストで回しましょう。',
        strengths: ['TOEIC対策に直結', '頻出表現を押さえやすい', '社会人に合う'],
        rules: {
            grade: { adult: 5 },
            goal: { toeic: 5 },
            level: { weak: 2, basic: 3, standard: 4 },
            style: { quick: 4, coverage: 2 },
        },
    },
];

function getRecommendations(answers: Answers) {
    return books
        .map((book) => {
            const score = questions.reduce((sum, question) => {
                const answer = answers[question.id];
                if (!answer) return sum;
                return sum + (book.rules[question.id]?.[answer] ?? 0);
            }, 0);
            return { ...book, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

export default function TextbookDiagnosisClient() {
    const [answers, setAnswers] = useState<Answers>({});
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const currentQuestion = questions[step];
    const recommendations = useMemo(() => getRecommendations(answers), [answers]);
    const progress = completed ? 100 : Math.round((step / questions.length) * 100);

    function selectChoice(questionId: QuestionId, value: string) {
        const nextAnswers = { ...answers, [questionId]: value };
        setAnswers(nextAnswers);

        if (step >= questions.length - 1) {
            setCompleted(true);
            return;
        }

        setStep((current) => current + 1);
    }

    function resetDiagnosis() {
        setAnswers({});
        setStep(0);
        setCompleted(false);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Sparkles className="w-4 h-4 text-rose-500" aria-hidden="true" />
                        単語帳診断
                    </div>
                    <div className="text-sm text-slate-500">
                        {completed ? '結果' : `${step + 1} / ${questions.length}`}
                    </div>
                </div>
                <div className="h-2 bg-white border border-slate-200 rounded-full mt-3 overflow-hidden">
                    <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {!completed ? (
                <div className="p-5 md:p-8">
                    <p className="text-sm font-bold text-rose-600 mb-2">{currentQuestion.eyebrow}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{currentQuestion.title}</h2>
                    <div className="grid gap-3">
                        {currentQuestion.choices.map((choice) => (
                            <button
                                key={choice.value}
                                type="button"
                                onClick={() => selectChoice(currentQuestion.id, choice.value)}
                                className="group text-left rounded-lg border border-slate-200 bg-white px-4 py-4 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-rose-700">{choice.label}</div>
                                        <div className="text-sm text-slate-500 mt-1 leading-relaxed">{choice.description}</div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-rose-500 mt-1 shrink-0" aria-hidden="true" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-5 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                        <div>
                            <p className="text-sm font-bold text-rose-600 mb-2">Result</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">あなたに合う単語帳</h2>
                        </div>
                        <button
                            type="button"
                            onClick={resetDiagnosis}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                        >
                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                            もう一度診断
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {recommendations.map((book, index) => (
                            <article key={book.name} className="rounded-lg border border-slate-200 bg-white p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                                                第{index + 1}候補
                                            </span>
                                            <span className="text-xs font-bold text-slate-500">{book.levelLabel}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{book.name}</h3>
                                        <p className="text-slate-600 mt-2 leading-relaxed">{book.summary}</p>
                                    </div>
                                    {index === 0 && (
                                        <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700 shrink-0">
                                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                            最有力
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-3 mt-5">
                                    {book.strengths.map((strength) => (
                                        <div key={strength} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                                            {strength}
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-5 text-sm text-slate-500 leading-relaxed">{book.strategy}</p>

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <AmazonTextbookLink textbookName={book.amazonQuery} />
                                    <Link
                                        href={book.mistapPath}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-700 transition-colors"
                                    >
                                        <BookOpen className="w-5 h-5" aria-hidden="true" />
                                        Mistapでテストする
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                        Amazonリンクはアソシエイトリンクです。価格・在庫はAmazonの商品ページでご確認ください。
                    </p>
                </div>
            )}
        </div>
    );
}
