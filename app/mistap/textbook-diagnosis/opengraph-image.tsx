import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '英単語帳診断 - Mistap';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontFamily: 'sans-serif',
                    padding: 56,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 16,
                        backgroundColor: '#e11d48',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        left: 0,
                        right: 0,
                        height: 8,
                        backgroundColor: '#2563eb',
                    }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, zIndex: 1 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            color: '#e11d48',
                            fontSize: 30,
                            fontWeight: 800,
                        }}
                    >
                        <span
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 46,
                                height: 46,
                                borderRadius: 23,
                                backgroundColor: '#ffe4e6',
                            }}
                        >
                            M
                        </span>
                        <span>Mistap</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignSelf: 'flex-start',
                                backgroundColor: '#fff1f2',
                                color: '#be123c',
                                border: '2px solid #fecdd3',
                                borderRadius: 999,
                                padding: '10px 22px',
                                fontSize: 28,
                                fontWeight: 800,
                            }}
                        >
                            目的別に選べる英単語帳診断
                        </div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 76,
                                lineHeight: 1.08,
                                fontWeight: 900,
                                letterSpacing: 0,
                                maxWidth: 860,
                            }}
                        >
                            あなたに合う英単語帳を診断
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                maxWidth: 920,
                                fontSize: 34,
                                lineHeight: 1.45,
                                color: '#475569',
                                fontWeight: 700,
                            }}
                        >
                            大学受験・英検・TOEIC・定期テストに合う1冊を選び、Mistapで小テストまで始められます。
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 18, zIndex: 1 }}>
                    {['大学受験', '英検', 'TOEIC', '定期テスト'].map((label) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                                borderRadius: 14,
                                padding: '18px 26px',
                                fontSize: 28,
                                fontWeight: 800,
                                color: '#1e293b',
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        ),
        { ...size }
    );
}
