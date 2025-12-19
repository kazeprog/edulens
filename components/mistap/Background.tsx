import React from 'react';
import Image from 'next/image';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function Background({ children, className = "" }: BackgroundProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 ${className}`}>
      {/* 背景ロゴ */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/mistap-logo.png"
          alt="Mistap Background"
          width={800}
          height={600}
          className="opacity-15 blur-sm scale-130"
          priority={false}
        />
      </div>
      
      {/* コンテンツ */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}