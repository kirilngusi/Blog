import React from "react";

import Link from "next/link";
import { SiNextdotjs, SiNotion, SiVercel } from "react-icons/si";

import { localePath, useLocale, useT } from "../lib/i18n";

const Footer = () => {
    const t = useT();
    const locale = useLocale();
    const links = [
        { name: t.nav.blog, href: "/blog" },
        { name: t.nav.about, href: "/about" },
        { name: t.nav.projectsShort, href: "/projectsnsocials" },
    ];

    return (
        <footer className="primary-text p-6 text-center text-xs">
            <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {links.map((l) => (
                    <Link href={l.href} key={l.href}>
                        <a className="transition-colors hover:text-accent-600 dark:hover:text-accent-400">
                            {l.name}
                        </a>
                    </Link>
                ))}
                {/* RSS was previously only discoverable via <link> in the head.
                    Plain <a>: next/link would client-side route and never
                    deliver the XML. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                    href={localePath(locale, "/rss.xml")}
                    className="transition-colors hover:text-accent-600 dark:hover:text-accent-400"
                >
                    RSS
                </a>
            </nav>

            <div className="my-2 inline-flex items-center space-x-2 ">
                <div className="bg-inherit">
                    <SiNextdotjs size={16} />
                </div>

                <SiNotion size={16} />
                <SiVercel size={16} />
            </div>
            <div></div>
            <div className="">©️ 2022 - {new Date().getFullYear()}</div>
        </footer>
    );
};

export default Footer;
