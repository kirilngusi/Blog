import "../styles/globals.css";

import Layout from "../components/Layout";

import type { AppProps } from "next/app";
import Router from "next/router";

import NProgress from 'nprogress';
import "nprogress/nprogress.css";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import Head from "next/head";
import ReactGA from "react-ga4";
import { useEffect } from "react";

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        ReactGA.initialize("G-KCMPTVY7L2");

        ReactGA.send({ hitType: "pageview", page: window.location.pathname });

        const handleRouteChange = (url: string) => {
            ReactGA.send({ hitType: "pageview", page: url });
        };

        Router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            Router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, []);
    return (
        <>
        <Head>
            <meta charSet="UTF-8" />
            <meta name="keywords" content="titla, meta, nextjs" />
            <meta name="author" content="KirilDev" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="KirilNgusi's personal website" />
            <meta name="keywords" content="KirilNgusi, Kiril, KirilNgusi's personal website" />
            <meta name="author" content="KirilNgusi" />
            <meta property="og:title" content="KirilNgusi" />
            <meta property="og:description" content="KirilNgusi's personal website" />
            <meta property="og:image" content="/favicon.ico" />
            <meta property="og:url" content="https://kirilngusi.vercel.app/" />
            <meta property="og:type" content="website" />
        </Head>
        <Layout>
            <Component {...pageProps} />
        </Layout>
        </>
    );
}

export default MyApp;
