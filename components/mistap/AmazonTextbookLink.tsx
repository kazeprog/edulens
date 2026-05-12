import { ShoppingCart, ExternalLink } from 'lucide-react';
import { getAmazonTextbookLink } from '@/lib/mistap/amazon-textbooks';

type Props = {
    textbookName: string;  // 例: "システム英単語", "ターゲット1900"
    trackingId?: string;   // トラッキングID
    asin?: string;
    searchQuery?: string;
    displayName?: string;
    allowSearchFallback?: boolean;
};

export default function AmazonTextbookLink({
    textbookName,
    trackingId = "edulens-22",
    asin,
    searchQuery,
    displayName,
    allowSearchFallback,
}: Props) {

    const amazonLink = getAmazonTextbookLink({
        textbookName,
        trackingId,
        asin,
        searchQuery,
        displayName,
        allowSearchFallback,
    });

    if (!amazonLink) {
        return null;
    }

    return (
        <a
            href={amazonLink.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative inline-flex max-w-full items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-md hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-300"
            aria-label={`${amazonLink.label}をAmazonで確認する`}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="flex min-w-0 flex-col items-start leading-none gap-1">
                <span className="max-w-56 text-xs text-slate-500 font-bold tracking-wider leading-snug">{amazonLink.label}</span>
                <span className="text-base font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                    {amazonLink.isProductPage ? 'Amazonの商品ページへ' : 'Amazonでチェックする'}
                </span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-orange-300 ml-1 transition-colors" />
        </a>
    );
}
