import "../styles/globals.css";

import Layout from "../components/Layout";

import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";

import { AnimatePresence, motion } from "framer-motion";

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
    const router = useRouter();
    useEffect(() => {
        ReactGA.initialize("G-095Z4SJ71C");

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
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#059669" />
        </Head>
        <Layout>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={router.route}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    <Component {...pageProps} />
                </motion.div>
            </AnimatePresence>
        </Layout>
        </>
    );
}

export default MyApp;
