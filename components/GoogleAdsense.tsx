'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

type GoogleAdsenseProps = {
    slot?: string;
    client?: string;
    style?: React.CSSProperties;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: 'true' | 'false';
    className?: string;
};

const GoogleAdsense = ({
    slot = "9969163744",
    client = "ca-pub-6321932201615449",
    style = { display: 'block', minHeight: '280px' },
    format = 'auto',
    responsive = 'true',
    className = "mb-4",
}: GoogleAdsenseProps) => {
    const pathname = usePathname();

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('Google AdSense error:', err);
        }
    }, [pathname]);

    return (
        <div className={className} style={{ minHeight: style?.minHeight || '280px', width: '100%' }}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default GoogleAdsense;
