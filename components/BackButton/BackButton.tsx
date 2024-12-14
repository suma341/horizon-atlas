import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="p-3 bg-slate-900 text-white rounded-md shadow-xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
      戻る
    </button>
  );
};

export default BackButton;