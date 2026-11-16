// contexts & globals
import { GlobalStateProvider } from "../src/Contexts & Globals/GlobalContext";
import theme from "../src/Contexts & Globals/theme";
import "../styles/globals.css";
import "../i18n";

// react & next
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

// external dependencies
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import mixpanel from "mixpanel-browser";

// others
// import { version } from '../package.json';

function OrangerySpaceApp({ Component, pageProps }: AppProps) {
  // console.log(`v: ${version}`)

  const router = useRouter();
  const queryClient = new QueryClient();

  React.useEffect(() => {
    // Enabling the debug mode flag is useful during implementation,
    // but it's recommended you remove it for production
    mixpanel.init(
      process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "",
      {
        debug: process.env.NEXT_PUBLIC_ENV_MODE !== "production"
      }
    );

    // // force clearing localStorage on each version change // should be tested more and then implemented
    // if (
    //   !(localStorage.getItem("current_software_version")
    //     && localStorage.getItem("current_software_version") === version
    //   )
    // ) {
    //   localStorage.clear();
    //   localStorage.setItem("current_software_version", version)
    // }

    // /booking/ should not be here, but because of printed qrs, we change it!
    if (router.route.indexOf("/_p/") === -1 && router.route.indexOf("/booking/") === -1)
      if (!localStorage.getItem("__token__"))
        if (router.route.indexOf("/auth/") === -1) {
          router.replace(`/auth/login`);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`}
        />

        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>

        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
          
              // gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID}');
            `,
          }}
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <GlobalStateProvider>
            <Component {...pageProps} />
          </GlobalStateProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default OrangerySpaceApp;
