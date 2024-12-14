import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, router }: AppProps) {
  const noLayout = router.pathname === "/";
  return noLayout ? (
    <div className='bg-neutral-200'>
      <Component {...pageProps} />
    </div>
  ) : (
  <Layout>
    <Component {...pageProps} />
  </Layout>
  );
}
