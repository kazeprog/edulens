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
        title: `不規則動詞の過去形・過去分詞形 テスト｜Mistap`,
        description: `不規則動詞の過去形・過去分詞形に対応した無料単語テスト。完了形や受け身に必須の活用を学ぼう。`,
    };
}

export default async function PastParticipleSectionPage({ params }: PageProps) {
    const { section } = await params;
    const config = WORDBOOK_CONFIG['past-participle'];
    const range = config.getRange(1);

    return (
        <TextbookUnitLPTemplate
            textbookName="Past Participle"
            textbookNameJa="不規則動詞の過去形・過去分詞形"
            publisherName="基礎"
            themeColor="indigo"
            presetTextbook="過去形、過去分詞形"
            unitLabel="Part"
            unitValue={section}
            initialStartNum={range.start}
            initialEndNum={range.end}
            audience="junior"
        />
    );
}
