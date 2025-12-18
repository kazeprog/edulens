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

    const logoData = await fetch(new URL('https://edulens.jp/logo.png')).then((res) => res.arrayBuffer()).catch(() => null);

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

    // Blue Theme (matches High School)
    const themeColor = '#2563ea'; // blue-600
    const bgColor = '#eff6ff'; // blue-50

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
                    border: `16px solid ${themeColor}`,
                    position: 'relative',
                    fontFamily: '"sans-serif"',
                }}
            >
                {/* Decorations */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 256,
                    height: 256,
                    backgroundColor: bgColor,
                    borderBottomLeftRadius: 256,
                    opacity: 0.5,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 192,
                    height: 192,
                    backgroundColor: bgColor,
                    borderTopRightRadius: 192,
                    opacity: 0.5,
                }} />

                {/* Content Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, width: '100%', paddingLeft: 40, paddingRight: 40 }}>
                    {/* Header: Session Name */}
                    <h2 style={{
                        fontSize: 48,
                        fontWeight: 'bold',
                        color: '#64748b',
                        marginBottom: 16,
                        margin: 0,
                    }}>
                        {sessionName}
                    </h2>

                    {/* Title: Exam Name */}
                    <h1 style={{
                        fontSize: 80,
                        fontWeight: 900,
                        color: '#1e293b',
                        marginBottom: 24,
                        marginTop: 16,
                        textAlign: 'center',
                        lineHeight: 1.1,
                    }}>
                        {examName}
                    </h1>

                    {/* Date Line */}
                    <div style={{
                        display: 'flex',
                        borderBottom: `4px solid ${themeColor}`,
                        paddingBottom: 4,
                        marginBottom: 24,
                    }}>
                        <p style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                            <span style={{
                                fontSize: 28,
                                color: '#94a3b8',
                                fontWeight: 500,
                                marginRight: 24,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>DATE</span>
                            <span style={{
                                fontSize: 40,
                                fontWeight: 'bold',
                                color: '#334155',
                            }}>{examDateText}</span>
                        </p>
                    </div>

                    {/* Countdown Area */}
                    <div style={{ marginBottom: 16 }}>
                        {isExpired ? (
                            <div style={{ fontSize: 120, fontWeight: 900, color: themeColor }}>試験終了</div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <span style={{
                                    fontSize: 40, // text-xl * 2
                                    fontWeight: 'bold',
                                    color: '#94a3b8',
                                    marginBottom: 32,
                                    marginRight: 16,
                                }}>あと</span>
                                <span style={{
                                    fontSize: 256,
                                    fontWeight: 900,
                                    color: themeColor,
                                    lineHeight: 1,
                                    letterSpacing: '-0.05em',
                                }}>{diffDays}</span>
                                <span style={{
                                    fontSize: 48,
                                    fontWeight: 'bold',
                                    color: '#94a3b8',
                                    marginBottom: 32,
                                    marginLeft: 16,
                                }}>日</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 48,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.7,
                }}>
                    <span style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#94a3b8',
                        letterSpacing: '0.1em',
                        marginRight: 16,
                    }}>EduLens.jp</span>
                    {logoData && (
                        <img
                            src={logoData as any}
                            width={48}
                            height={48}
                            style={{ objectFit: 'contain' }}
                        />
                    )}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
