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
};

export default function NaruhodoLensPage() {
    return <ChatInterface />;
}
