import React from "react";
import Head from "next/head";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div>
            <Head>
                {/* Title and description are owned by <SEO /> on each page. */}
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className="flex flex-col min-h-screen ">
                <Navbar/>

                <main
                    // style={{
                    //     maxWidth: "calc(90ch + 32px)",
                    // }}
                    // className="flex flex-1 flex-col justify-center justify-items-center	"
                    className="mt-8 flex-1 flex flex-col justify-center">

                    {children}
                </main>

                <Footer/>
            </div>
        </div>
    );
};

export default Layout;
