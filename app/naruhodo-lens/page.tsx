import ChatInterface from '@/components/NaruhodoLens/ChatInterface';

export const metadata = {
    title: 'ナルホドレンズ | EduLens',
    description: '問題の画像をアップロードすると、AIがステップバイステップで解説してくれます。',
};

export default function NaruhodoLensPage() {
    return <ChatInterface />;
}
