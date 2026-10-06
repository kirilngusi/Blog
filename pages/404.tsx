import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHome, FiArrowRight } from "react-icons/fi";

import SEO from "../components/SEO";
import { useT } from "../lib/i18n";

const NotFound = () => {
    const [pathname, setPathname] = useState("");
    const t = useT();

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    return (
        <>
            <SEO
                title={t.notFound.title}
                description={t.notFound.description}
                noindex
            />

            <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center text-black dark:text-dark-50">
                <h1 className="font-serif text-7xl font-bold leading-none sm:text-8xl">
                    <span className="bg-gradient-to-r from-accent-500 to-cyan-400 bg-clip-text text-transparent">
                        404
                    </span>
                </h1>
                <p className="mt-3 text-lg font-semibold text-gray-700 dark:text-dark-50">
                    {t.notFound.heading}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-200">
                    {t.notFound.sub}
                </p>

                {/* Terminal-style error */}
                <div className="mt-8 w-full overflow-x-auto rounded-xl border border-light-800 bg-light-200 p-4 text-left font-mono text-sm dark:border-dark-600 dark:bg-dark-800">
                    <div className="whitespace-nowrap">
                        <span className="text-gray-400 dark:text-dark-300">
                            ${" "}
                        </span>
                        <span className="text-amber-500 dark:text-amber-400">
                            website
                        </span>
                        <span className="text-gray-500 dark:text-dark-200">.</span>
                        <span className="text-cyan-600 dark:text-cyan-400">
                            at
                        </span>
                        <span className="text-gray-500 dark:text-dark-200">(</span>
                        <span className="text-accent-600 dark:text-accent-400">
                            &apos;{pathname || "/…"}&apos;
                        </span>
                        <span className="text-gray-500 dark:text-dark-200">)</span>
                    </div>
                    <div className="mt-1.5 text-rose-500 dark:text-rose-400">
                        ↳ IndexError: route is out of bounds
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/">
                        <a className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700">
                            <FiHome size={16} /> {t.notFound.home}
                        </a>
                    </Link>
                    <Link href="/blog">
                        <a className="group inline-flex items-center gap-1.5 rounded-lg border border-light-800 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300">
                            {t.notFound.readBlog}
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
