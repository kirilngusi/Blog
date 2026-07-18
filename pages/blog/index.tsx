import React, { useMemo, useState } from "react";

import { getAllPosts } from "../../lib/notion";
import { PostMeta, toPostMeta, formatDate } from "../../lib/posts";

import Highlighter from "react-highlight-words";
import Link from "next/link";
import ReactGA from "react-ga4";

import Fuse from "fuse.js";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

import SEO from "../../components/SEO";

const handleClick = () => {
    ReactGA.event({ action: "click to read", category: "read" });
};

const PostCard = ({ post, terms }: { post: PostMeta; terms: string[] }) => (
    <Link href={`/blog/${post.slug}`}>
        <a
            onClick={handleClick}
            className="group block rounded-xl border border-light-800 p-5 transition-all hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-sm dark:border-dark-600 dark:hover:border-accent-400"
        >
            <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-bold text-black transition-colors group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                    <Highlighter
                        highlightClassName="bg-accent-200 text-accent-900 rounded px-0.5"
                        searchWords={terms}
                        autoEscape
                        textToHighlight={post.title}
                    />
                </h3>
                <time className="shrink-0 font-mono text-xs text-gray-400 dark:text-dark-200">
                    {formatDate(post.date)}
                </time>
            </div>
            {post.description && (
                <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-dark-100">
                    <Highlighter
                        highlightClassName="bg-accent-200 text-accent-900 rounded px-0.5"
                        searchWords={terms}
                        autoEscape
                        textToHighlight={post.description}
                    />
                </p>
            )}
            {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-full bg-light-700 px-2 py-0.5 text-xs text-gray-500 dark:bg-dark-600 dark:text-dark-100"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </a>
    </Link>
);

const AllPost = ({ posts }: { posts: PostMeta[] }) => {
    const [query, setQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // All posts' metadata is tiny, so client-side fuzzy search stays instant
    // even at hundreds of posts. (For thousands, move to a prebuilt index or a
    // server-side search endpoint.)
    const fuse = useMemo(
        () =>
            new Fuse(posts, {
                keys: ["title", "description", "tags"],
                threshold: 0.35,
                ignoreLocation: true,
            }),
        [posts]
    );

    const allTags = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [posts]);

    const results = useMemo(() => {
        const base = query.trim()
            ? fuse.search(query.trim()).map((r) => r.item)
            : posts;
        return activeTag ? base.filter((p) => p.tags.includes(activeTag)) : base;
    }, [query, activeTag, fuse, posts]);

    const terms = query.trim() ? query.trim().split(" ") : [];

    return (
        <div className="mx-auto max-w-3xl px-6 text-black dark:text-dark-50">
            <SEO
                title="Blog"
                description="Notes on backend engineering, distributed systems, and things I'm learning."
                path="/blog"
            />

            <section className="mb-6">
                <h1 className="mb-3 font-serif text-4xl font-bold">Blog</h1>
                <p className="mb-5 leading-7 text-gray-600 dark:text-dark-100">
                    Notes on backend engineering, distributed systems, and
                    things I&apos;m learning along the way.
                </p>

                <div className="relative">
                    <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full rounded-lg border border-light-800 bg-white/60 py-2.5 pl-10 pr-10 text-black outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 dark:border-dark-600 dark:bg-dark-700/40 dark:text-white"
                        type="text"
                        placeholder="Search posts..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-accent-600 dark:hover:text-accent-400"
                        >
                            <FiX />
                        </button>
                    )}
                </div>

                {allTags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTag(null)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                activeTag === null
                                    ? "bg-accent-600 text-white"
                                    : "bg-light-700 text-gray-600 hover:bg-light-800 dark:bg-dark-600 dark:text-dark-100 dark:hover:bg-dark-500"
                            }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() =>
                                    setActiveTag(activeTag === tag ? null : tag)
                                }
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    activeTag === tag
                                        ? "bg-accent-600 text-white"
                                        : "bg-light-700 text-gray-600 hover:bg-light-800 dark:bg-dark-600 dark:text-dark-100 dark:hover:bg-dark-500"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <div className="mb-4 text-sm font-medium text-gray-400 dark:text-dark-200">
                {query.trim() || activeTag
                    ? `${results.length} result${
                          results.length === 1 ? "" : "s"
                      }`
                    : `${posts.length} posts`}
            </div>

            <div className="flex flex-col gap-3">
                {results.map((post, i) => (
                    <motion.div
                        key={post.slug || i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                            duration: 0.4,
                            delay: Math.min(i * 0.04, 0.3),
                        }}
                    >
                        <PostCard post={post} terms={terms} />
                    </motion.div>
                ))}
            </div>

            {results.length === 0 && (
                <div className="mt-12 flex flex-col items-center justify-center text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-4 h-14 w-14 text-gray-300 dark:text-dark-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 14l2-2m0 0l2-2m-2 2l2 2m-2-2v6m0-6H5m14 0h-4m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="font-medium text-gray-500 dark:text-dark-200">
                        No posts found. Try a different search or tag.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllPost;

export const getStaticProps = async () => {
    const response = await getAllPosts();
    const posts = response.map(toPostMeta);

    return {
        props: { posts },
        revalidate: 60,
    };
};
