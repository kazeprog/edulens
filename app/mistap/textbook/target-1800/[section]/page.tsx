import { Metadata } from "next";
import TextbookUnitLPTemplate from "@/components/mistap/TextbookUnitLPTemplate";
import { WORDBOOK_CONFIG } from "@/lib/mistap/textbook-data";

interface PageProps {
    params: Promise<{ section: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
    const config = WORDBOOK_CONFIG['target-1800'];
    return Array.from({ length: config.totalUnits }, (_, i) => ({ section: (i + 1).toString() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { section } = await params;
    const title = `ターゲット1800 Section ${section} 英単語テスト｜Mistap`;
    return {
        title: title,
        description: `ターゲット1800のSection ${section} に対応した無料単語テスト。範囲を指定して効率よく暗記。中学・高校入試対策に最適。`,
        alternates: {
            canonical: `https://edulens.jp/mistap/textbook/target-1800/${section}`,
        }
    };
}

export default async function Target1800SectionPage({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['target-1800'];
    const secNum = parseInt(section, 10);
    const range = config.getRange(secNum);

    return (
        <TextbookUnitLPTemplate
            textbookName="Target 1800"
            textbookNameJa="ターゲット1800"
            publisherName="旺文社"
            themeColor="blue"
            presetTextbook="ターゲット1800"
            unitLabel="Section"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="junior"
        />
    );
}
