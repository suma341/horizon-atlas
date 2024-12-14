import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="my-5 text-slate-400 hover:text-slate-500 underline">
      戻る
    </button>
  );
};

export default BackButton;