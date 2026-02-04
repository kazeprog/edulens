import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  async redirects() {
    return [
      // Old book pages redirects
      {
        source: '/mistap/books/systan',
        destination: '/mistap/textbook/system-words',
        permanent: true,
      },
      {
        source: '/mistap/books/target-1900',
        destination: '/mistap/textbook/target-1900',
        permanent: true,
      },
      {
        source: '/mistap/books/target-1200',
        destination: '/mistap/textbook/target-1200',
        permanent: true,
      },
      {
        source: '/mistap/books/leap',
        destination: '/mistap/textbook/leap',
        permanent: true,
      },
      {
        source: '/mistap/books/duo-30',
        destination: '/mistap/textbook/duo-30',
        permanent: true,
      },
      {
        source: '/mistap/books/toeic-gold',
        destination: '/mistap/textbook/toeic-gold',
        permanent: true,
      },
      {
        source: '/mistap/books/kobun-315',
        destination: '/mistap/textbook/kobun-315',
        permanent: true,
      },
      {
        source: '/mistap/books/kobun-330',
        destination: '/mistap/textbook/kobun-330',
        permanent: true,
      },
      {
        source: '/mistap/books/kobun-325',
        destination: '/mistap/textbook/kobun-325',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
