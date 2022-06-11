import React from "react";
import Link from "next/link";

const Error = () => {
    let pathname = "";

    if (process.browser) {
        pathname = window.location.pathname;
    }

    return (
        <div className="mx-auto max-w-3xl px-6 text-black justify-center flex flex-col  ">
            <h2 className="text-rose-700 font-bold text-2xl mb-4">
                404: Page Not Found!
            </h2>
            <div className="mb-4">
                <span className="text-amber-400	">
                    website.at(
                    <span className="text-emerald-400	">
                        &lsquo;{pathname}&rsquo;
                    </span>
                    )
                </span>{" "}
                is out of bounds.
            </div>

            <Link href="/">
                <p className="hover:underline cursor-pointer">&gt; Go To Home Page</p>
            </Link>
        </div>
    );
};

export default Error;
