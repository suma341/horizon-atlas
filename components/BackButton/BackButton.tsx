import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      戻る
    </button>
  );
};

export default BackButton;