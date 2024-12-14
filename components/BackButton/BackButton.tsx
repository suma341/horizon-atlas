import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="my-5 text-slate-500 hover:text-slate-600 underline">
      ← 戻る
    </button>
  );
};

export default BackButton;