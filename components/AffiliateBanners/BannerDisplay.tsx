import React from 'react';

type BannerDisplayProps = {
    content: string | null | undefined;
};

export default function BannerDisplay({ content }: BannerDisplayProps) {
    if (!content) return null;

    return (
        <div className="flex flex-col items-center w-full">
            <span className="text-[10px] text-slate-400 self-center mb-1">PR</span>
            <div className="flex justify-center items-center w-full" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
