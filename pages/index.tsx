import LoginButton from "@/components/Auth/loginButton";
import Head from "next/head";

// Homeコンポーネント
export default function Home() {

  return (
    <>
      <Head>
        <title>Horizon TechShelf</title>
      </Head>
      <div className="container h-full w-full mx-auto">
        <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Horizon TechShelf</h1>
        <LoginButton />
        </main>
      </div>
    </>
  );
}
