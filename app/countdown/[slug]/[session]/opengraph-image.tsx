import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase/client';

export const runtime = 'edge';

export const alt = '資格試験カウントダウン';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string; session: string } }) {
    const { slug, session } = await params;

    // データ取得
    // exam_schedules テーブルを使用
    const { data: exam } = await supabase
        .from('exam_schedules')
        .select('*')
        .eq('slug', slug)
        .eq('session_slug', session)
        .single();

    const examName = exam?.exam_name || '資格試験';
    const sessionName = exam?.session_name || '';

    let diffDays = 0;
    let isExpired = false;
    let examDateText = '';

    if (exam?.primary_exam_date) {
        const targetDate = new Date(exam.primary_exam_date);
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]);
        const diffTime = targetDate.getTime() - today.getTime();
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpired = diffDays < 0;

        examDateText = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    backgroundImage: 'linear-gradient(to bottom right, #e0e7ff, #ffffff)',
                    fontFamily: '"sans-serif"',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 36,
                        fontWeight: 'bold',
                        color: '#6366f1',
                        marginBottom: 20,
                        padding: '10px 30px',
                        backgroundColor: '#eef2ff',
                        borderRadius: 50,
                    }}>
                        {sessionName}
                    </div>

                    <div style={{
                        fontSize: 56,
                        fontWeight: 'bold',
                        color: '#1e293b',
                        marginBottom: 10,
                        maxWidth: 1000,
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                    }}>
                        {examName}
                    </div>

                    {isExpired ? (
                        <div style={{ fontSize: 120, fontWeight: 900, color: '#4f46e5' }}>
                            試験終了
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <span style={{ fontSize: 60, fontWeight: 'bold', color: '#64748b', marginBottom: 30, marginRight: 20 }}>あと</span>
                            <span style={{ fontSize: 220, fontWeight: 900, color: '#4f46e5', lineHeight: 1, letterSpacing: '-0.05em' }}>
                                {diffDays}
                            </span>
                            <span style={{ fontSize: 60, fontWeight: 'bold', color: '#64748b', marginBottom: 30, marginLeft: 20 }}>日</span>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: '#334155',
                        marginTop: 40,
                        borderBottom: '4px solid #4f46e5',
                        paddingBottom: 10
                    }}>
                        試験日: {examDateText || '未定'}
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 40, right: 50, display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.1em' }}>EduLens.jp</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
