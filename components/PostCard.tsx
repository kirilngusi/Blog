import React from "react";

import Link from "next/link";
import Highlighter from "react-highlight-words";
import ReactGA from "react-ga4";

import { PostMeta, formatDate } from "../lib/posts";
import { toLocale, useLocale, useT } from "../lib/i18n";

const handleClick = () => {
    ReactGA.event({ action: "click to read", category: "read" });
};

// Shared across the homepage, the blog list and tag pages. `terms` only has a
// value on the blog list (the one surface with a search box); everywhere else
// Highlighter falls through to plain text.
const PostCard = ({ post, terms = [] }: { post: PostMeta; terms?: string[] }) => {
    const locale = useLocale();
    const t = useT();
    // Set when this is an untranslated fallback in another language.
    const foreignLang =
        post.lang && post.lang !== locale ? toLocale(post.lang) : null;

    return (
        <Link href={`/blog/${post.slug}`}>
            <a
                onClick={handleClick}
                className="group block rounded-xl border border-light-800 p-5 transition-all hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-sm dark:border-dark-600 dark:hover:border-accent-400"
            >
                <div className="flex items-baseline justify-between gap-4">
                    <h3
                        lang={foreignLang ?? undefined}
                        className="font-bold text-black transition-colors group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400"
                    >
                        <Highlighter
                            highlightClassName="bg-accent-200 text-accent-900 rounded px-0.5"
                            searchWords={terms}
                            autoEscape
                            textToHighlight={post.title}
                        />
                    </h3>
                    <time className="shrink-0 font-mono text-xs text-gray-400 dark:text-dark-200">
                        {formatDate(post.date, locale)}
                    </time>
                </div>
                {post.description && (
                    <p
                        lang={foreignLang ?? undefined}
                        className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-dark-100"
                    >
                        <Highlighter
                            highlightClassName="bg-accent-200 text-accent-900 rounded px-0.5"
                            searchWords={terms}
                            autoEscape
                            textToHighlight={post.description}
                        />
                    </p>
                )}
                {(post.tags.length > 0 || foreignLang) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {foreignLang && (
                            <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                                {t.langName[foreignLang]}
                            </span>
                        )}
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-light-700 px-2 py-0.5 text-xs text-gray-500 dark:bg-dark-600 dark:text-dark-100"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </a>
        </Link>
    );
};

export default PostCard;
