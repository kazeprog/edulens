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

    // ロゴ画像の取得 (Base64 data URIに変換)
    let logoSrc: string | null = null;
    try {
        const logoRes = await fetch(new URL('https://edulens.jp/logo.png'));
        if (logoRes.ok) {
            const buffer = await logoRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            logoSrc = `data:image/png;base64,${base64}`;
        }
    } catch (e) {
        // ロゴの取得に失敗した場合は表示しない
    }

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
            const targetDate = new Date(examData.date + 'T00:00:00+09:00'); // JST
            const now = new Date();
            // JSTでの本日の0時を取得
            const todayJST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
            todayJST.setHours(0, 0, 0, 0);

            const diffTime = targetDate.getTime() - todayJST.getTime();
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
                    border: '16px solid #2563ea',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorations */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 256,
                    height: 256,
                    backgroundColor: '#eff6ff',
                    borderBottomLeftRadius: 256,
                    opacity: 0.5,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: 192,
                    height: 192,
                    backgroundColor: '#eff6ff',
                    borderTopRightRadius: 192,
                    opacity: 0.5,
                }} />

                {/* Content Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, width: '100%' }}>
                    {/* Header */}
                    <h2 style={{
                        fontSize: 48,
                        fontWeight: 'bold',
                        color: '#64748b',
                        margin: 0,
                        marginBottom: 16,
                    }}>
                        {year}年度 公立高校入試
                    </h2>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 96,
                        fontWeight: 900,
                        color: '#1e293b',
                        marginTop: 16,
                        marginBottom: 24,
                        letterSpacing: '-0.025em',
                    }}>
                        {prefName}
                    </h1>

                    {/* Date Line */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '4px solid #2563ea',
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
                    <div style={{ display: 'flex', marginBottom: 16 }}>
                        {isExpired ? (
                            <div style={{ fontSize: 120, fontWeight: 900, color: '#2563ea' }}>試験終了</div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <span style={{
                                    fontSize: 40,
                                    fontWeight: 'bold',
                                    color: '#94a3b8',
                                    marginBottom: 32,
                                    marginRight: 16,
                                }}>あと</span>
                                <span style={{
                                    fontSize: 200,
                                    fontWeight: 900,
                                    color: '#2563ea',
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
                    {logoSrc && (
                        <img
                            src={logoSrc}
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
