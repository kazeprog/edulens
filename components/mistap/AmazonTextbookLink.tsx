import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';

type Props = {
    textbookName: string;  // 例: "システム英単語", "ターゲット1900"
    trackingId?: string;   // トラッキングID
};

export default function AmazonTextbookLink({
    textbookName,
    trackingId = "edulens-22",
}: Props) {

    const searchQuery = encodeURIComponent(textbookName);
    const amazonUrl = `https://www.amazon.co.jp/s?k=${searchQuery}&tag=${trackingId}`;

    return (
        <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative inline-flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-md hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-300"
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-500 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-xs text-slate-500 font-bold tracking-wider">{textbookName}</span>
                <span className="text-base font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                    Amazonでチェックする
                </span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-orange-300 ml-1 transition-colors" />
        </a>
    );
}
