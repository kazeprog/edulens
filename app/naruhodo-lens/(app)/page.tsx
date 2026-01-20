import ChatInterface from '@/components/NaruhodoLens/ChatInterface';

export const metadata = {
    title: 'ナルホドレンズ | EduLens',
    description: '問題の画像をアップロードすると、AIがステップバイステップで解説してくれます。',
    openGraph: {
        title: 'ナルホドレンズ | EduLens',
        description: '問題の画像をアップロードすると、AIがステップバイステップで解説してくれます。',
        images: ['/naruhodolenslogo.png'],
    },
    twitter: {
        card: 'summary',
        images: ['/naruhodolenslogo.png'],
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        ],
        shortcut: [{ url: '/favicon.ico' }],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
};

export default function NaruhodoLensPage() {
    return <ChatInterface />;
}
