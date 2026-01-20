import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

type QualificationLink = {
    slug: string;
    exam_name: string;
};

export default async function OtherQualifications({ currentSlug }: { currentSlug: string }) {
    // 全資格試験のユニークなslug一覧を取得
    const { data: allExams } = await supabase
        .from('exam_schedules')
        .select('slug, exam_name')
        .not('category', 'is', null)
        .order('exam_name', { ascending: true });

    if (!allExams || allExams.length === 0) return null;

    // slugごとにユニークにして、現在のページを除外
    const uniqueExams: QualificationLink[] = [];
    const seenSlugs = new Set<string>();

    for (const exam of allExams) {
        if (!seenSlugs.has(exam.slug) && exam.slug !== currentSlug) {
            seenSlugs.add(exam.slug);
            uniqueExams.push({ slug: exam.slug, exam_name: exam.exam_name });
        }
    }

    if (uniqueExams.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-16 mb-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    他の資格試験
                </h2>
                <div className="flex flex-wrap gap-2">
                    {uniqueExams.map((exam) => (
                        <Link
                            key={exam.slug}
                            href={`/countdown/${exam.slug}`}
                            prefetch={false}
                            className="inline-flex items-center px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-sm text-slate-700 hover:text-blue-700 transition-all font-medium"
                        >
                            {exam.exam_name}
                        </Link>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link
                        href="/countdown/qualification"
                        prefetch={false}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        資格試験一覧を見る
                    </Link>
                </div>
            </div>
        </div>
    );
}
