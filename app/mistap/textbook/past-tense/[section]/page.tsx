import { Metadata } from "next";
import TextbookUnitLPTemplate from "@/components/mistap/TextbookUnitLPTemplate";
import { WORDBOOK_CONFIG } from "@/lib/mistap/textbook-data";

interface PageProps {
    params: Promise<{ section: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
    return [{ section: "1" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `不規則動詞の過去形 テスト｜Mistap`,
        description: `不規則動詞の過去形に対応した無料単語テスト。基本の活用を完璧にマスター。`,
    };
}

export default async function PastTenseSectionPage({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['past-tense'];
    const range = config.getRange(1);

    return (
        <TextbookUnitLPTemplate
            textbookName="Past Tense"
            textbookNameJa="不規則動詞の過去形"
            publisherName="基礎"
            themeColor="blue"
            presetTextbook="過去形"
            unitLabel="Part"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="junior"
        />
    );
}
