import React from 'react';

type BannerDisplayProps = {
    content: string | null | undefined;
};

export default function BannerDisplay({ content }: BannerDisplayProps) {
    if (!content) return null;

    return (
        <div className="flex justify-center items-center w-full" dangerouslySetInnerHTML={{ __html: content }} />
    );
}
