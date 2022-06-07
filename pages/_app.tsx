import "../styles/globals.css";

import Layout from "../components/Layout";

import type { AppProps } from "next/app";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="KirilDev" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </Head>;
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
