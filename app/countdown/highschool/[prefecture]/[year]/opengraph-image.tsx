import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase/client';

export const runtime = 'edge';

export const alt = '公立高校入試カウントダウン';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { prefecture: string; year: string } }) {
    const { prefecture, year } = await params;

    // ロゴ画像の取得 (絶対URLが必要)
    // Vercel等の環境では `https://edulens.jp/logo.png` とする
    const logoData = await fetch(new URL('https://edulens.jp/logo.png')).then((res) => res.arrayBuffer()).catch(() => null);

    // データ取得
    const { data: prefData } = await supabase
        .from('prefectures')
        .select('id, name')
        .eq('slug', prefecture)
        .single();

    const prefName = prefData?.name || prefecture.toUpperCase();
    let diffDays = 0;
    let isExpired = false;
    let examDateText = '';

    if (prefData?.id) {
        const { data: examData } = await supabase
            .from('official_exams')
            .select('date')
            .eq('prefecture_id', prefData.id)
            .eq('year', parseInt(year))
            .eq('category', 'public_general')
            .single();

        if (examData?.date) {
            const targetDate = new Date(examData.date);
            const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }).split('T')[0]);
            const diffTime = targetDate.getTime() - today.getTime();
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            isExpired = diffDays < 0;

            examDateText = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;
        }
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
                    border: '16px solid #2563ea', // blue-600 equivalent (scaled x2 from 4px?? no, 1200w so maybe 16px is robust)
                    // Original was 4px on 600px width. So 8px on 1200px width.
                    // Let's go with 12px for better visibility.
                    position: 'relative',
                    fontFamily: '"sans-serif"',
                }}
            >
                {/* Decorations */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 256, // 32 * 4 * 2 = 256? Original w-32 (128px). 
                    // Tailwind w-32 is 8rem = 128px.
                    // On 600px canvas it was w-32 (128px).
                    // On 1200px canvas it should be 256px.
                    height: 256,
                    backgroundColor: '#eff6ff', // blue-50
                    borderBottomLeftRadius: 256, // rounded-bl-full
                    opacity: 0.5,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 192, // w-24 (96px) * 2 = 192
                    height: 192,
                    backgroundColor: '#eff6ff', // blue-50
                    borderTopRightRadius: 192, // rounded-tr-full
                    opacity: 0.5,
                }} />

                {/* Content Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, width: '100%' }}>
                    {/* Header: Year + Pref */}
                    <h2 style={{
                        fontSize: 48, // 2xl (24px) * 2 = 48
                        fontWeight: 'bold',
                        color: '#64748b', // slate-500
                        marginBottom: 16,
                        margin: 0,
                    }}>
                        {year}年度 公立高校入試
                    </h2>

                    {/* Title: Pref Name */}
                    <h1 style={{
                        fontSize: 96, // 5xl (48px) * 2 = 96
                        fontWeight: 900,
                        color: '#1e293b', // slate-800
                        marginBottom: 24, // mb-6 (24px) * 2 = 48
                        marginTop: 16,
                        letterSpacing: '-0.025em',
                    }}>
                        {prefName}
                    </h1>

                    {/* Date Line */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '4px solid #2563ea', // blue-600
                        paddingBottom: 4,
                        marginBottom: 24,
                    }}>
                        <p style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                            <span style={{
                                fontSize: 28, // text-sm (14px) * 2
                                color: '#94a3b8', // slate-400
                                fontWeight: 500,
                                marginRight: 24,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>DATE</span>
                            <span style={{
                                fontSize: 40, // text-xl (20px) * 2
                                fontWeight: 'bold',
                                color: '#334155', // slate-700
                            }}>{examDateText}</span>
                        </p>
                    </div>

                    {/* Countdown Area */}
                    <div style={{ marginBottom: 16 }}>
                        {isExpired ? (
                            <div style={{ fontSize: 120, fontWeight: 900, color: '#2563ea' }}>試験終了</div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <span style={{
                                    fontSize: 40, // text-xl * 2
                                    fontWeight: 'bold',
                                    color: '#94a3b8', // slate-400
                                    marginBottom: 32,
                                    marginRight: 16,
                                }}>あと</span>
                                <span style={{
                                    fontSize: 256, // text-8xl (96px) * 2 = 192... wait. 8xl is 6rem (96px). 
                                    // Let's make it bigger. 256px looks good for impact.
                                    fontWeight: 900,
                                    color: '#2563ea', // blue-600
                                    lineHeight: 1,
                                    letterSpacing: '-0.05em',
                                }}>{diffDays}</span>
                                <span style={{
                                    fontSize: 48, // text-2xl (24px) * 2
                                    fontWeight: 'bold',
                                    color: '#94a3b8', // slate-400
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
                        fontSize: 24, // text-xs * 2 = 24? No, text-xs is 12px. 24px is legible.
                        fontWeight: 'bold',
                        color: '#94a3b8', // slate-400
                        letterSpacing: '0.1em',
                        marginRight: 16,
                    }}>EduLens.jp</span>
                    {/* Logo Image */}
                    {logoData && (
                        <img
                            src={logoData as any}
                            width={48} // h-6 (24px) * 2 = 48
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
