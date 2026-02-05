import MathTestSetupContent from '@/components/mathtap/MathTestSetupContent';
import Background from '@/components/mistap/Background';
import MistapFooter from '@/components/mistap/Footer';

export const metadata = {
    title: 'Mathtap - 数学計算練習',
    description: '数学の計算問題を反復練習できるMathtap。',
};

export default function MathtapSetupPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Background className="flex justify-center items-start min-h-screen p-4 flex-grow bg-slate-900">
                <div className="mt-20 w-full max-w-md">
                    <MathTestSetupContent />
                </div>
            </Background>
            <MistapFooter />
        </main>
    );
}
