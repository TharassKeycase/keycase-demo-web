import "@/styles/globals.css";
import "nprogress/nprogress.css";

import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import NProgress from "nprogress";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";

import { theme } from "@/styles/theme";

import { CustomerProvider } from "@/provider/CustomerProvider";
import { OrderProvider } from "@/provider/OrderProvider";
import { ProductProvider } from "@/provider/ProductProvider";
import { HomeProvider } from "@/provider/HomeProvider";
import { UserProvider } from "@/provider/UserProvider";
import { SignupProvider } from "@/contexts/SignupContext";
import { SignupDrawer } from "@/components/auth/SignupDrawer";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>KEYCASE CRM APP - DEMO QA</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomeProvider>
          <Toaster />
          <SignupProvider>
            <UserProvider>
              <CustomerProvider>
                <OrderProvider>
                  <ProductProvider>
                    {getLayout(<Component {...pageProps} />)}
                    <SignupDrawer />
                  </ProductProvider>
                </OrderProvider>
              </CustomerProvider>
            </UserProvider>
          </SignupProvider>
        </HomeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default App;
