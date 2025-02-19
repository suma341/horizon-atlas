// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps}: AppProps) {
//   return <Component {...pageProps} />
// }

import { Auth0Provider } from "@auth0/auth0-react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

function App({ Component, pageProps }:AppProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={typeof window!=="undefined" ? { redirect_uri: window.location.origin } :{}}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}

export default App;
