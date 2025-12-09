import { redirect } from 'next/navigation';

export default function Home() {
  // トップページに来たら、強制的に /countdown へ飛ばす
  redirect('/countdown');
}

