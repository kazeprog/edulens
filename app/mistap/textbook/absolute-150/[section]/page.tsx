import { Metadata } from "next";
import TextbookUnitLPTemplate from "@/components/mistap/TextbookUnitLPTemplate";
import { WORDBOOK_CONFIG } from "@/lib/mistap/textbook-data";

interface PageProps {
    params: Promise<{ section: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['absolute-150'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `絶対覚える英単語150 Part ${section} テスト｜Mistap`;
    return {
        title: title,
        description: `絶対覚える英単語150のPart ${section} に対応した無料単語テスト。基本単語を完璧にマスターして中学英語の土台作り。`,
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/absolute-150/${section}`,
        }
    };
}

export default async function Absolute150SectionPage({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['absolute-150'];
    const secNum = parseInt(section, 10);
    const range = config.getRange(secNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="Words 150"
            textbookNameJa="絶対覚える英単語150"
            publisherName="基礎"
            themeColor="emerald"
            presetTextbook="絶対覚える英単語150"
            unitLabel="Part"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="junior"
        />
    );
}
