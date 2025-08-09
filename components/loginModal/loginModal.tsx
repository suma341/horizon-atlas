import { useRouter } from "next/router";

function LoginModal() {
  const redirectUri =
    process.env.NEXT_PUBLIC_ROOT_PATH ?? "https://sakiyamamamama.github.io/horizon-atlas";
  const router = useRouter();
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">ログインが必要です</h2>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => {
            router.push(redirectUri);
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default LoginModal;