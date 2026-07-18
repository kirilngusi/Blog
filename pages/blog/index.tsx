import React, { useState } from "react";

import { getAllPosts } from "../../lib/notion";

import Highlighter from "react-highlight-words";

import Link from "next/link";

import ReactGA from "react-ga4";

import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

import SEO from "../../components/SEO";

export interface SlugContent {
    text: {
        content: string;
    };
}

export interface Slug {
    rich_text: SlugContent[];
}

interface Title extends Slug {
    title: SlugContent[];
}

interface Description extends Slug {
    rich_text: SlugContent[];
}

interface IPost {
    id: string;
    slug: Slug;
    Title: Title;
    date: string;
    tag: string[];
    lang: "en" | "vi";
    Description: Description;
}

interface Result {
    properties: IPost;
    created_time: string;
}

const handleClick = () => {
    ReactGA.event({
        action: "click to read",
        category: "read",
    });
};

const formatDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getTitle = (r: Result) =>
    r?.properties?.Title?.title[0]?.text?.content || "";
const getDescription = (r: Result) =>
    r?.properties?.Description?.rich_text[0]?.text?.content || "";
const getSlug = (r: Result) =>
    r?.properties?.slug?.rich_text[0]?.text?.content?.trim() || "";

const PostCard = ({ post, terms }: { post: Result; terms: string[] }) => (
    <Link href={`/blog/${getSlug(post)}`}>
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
                        textToHighlight={getTitle(post)}
                    />
                </h3>
                <time className="shrink-0 font-mono text-xs text-gray-400 dark:text-dark-200">
                    {formatDate(post.created_time)}
                </time>
            </div>
            {getDescription(post) && (
                <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-dark-100">
                    <Highlighter
                        highlightClassName="bg-accent-200 text-accent-900 rounded px-0.5"
                        searchWords={terms}
                        autoEscape
                        textToHighlight={getDescription(post)}
                    />
                </p>
            )}
        </a>
    </Link>
);

const AllPost = ({ response }: { response: Result[] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const terms = searchTerm ? searchTerm.split(" ") : [];

    const filteredPosts = !searchTerm
        ? response
        : response.filter(
              (r) =>
                  getTitle(r)
                      .toLocaleLowerCase()
                      .includes(searchTerm.toLocaleLowerCase()) ||
                  getDescription(r)
                      .toLocaleLowerCase()
                      .includes(searchTerm.toLocaleLowerCase())
          );

    return (
        <div className="mx-auto max-w-3xl px-6 text-black dark:text-dark-50">
            <SEO
                title="Blog"
                description="Notes on backend engineering, distributed systems, and things I'm learning."
                path="/blog"
            />

            <section className="mb-8">
                <h1 className="mb-3 font-serif text-4xl font-bold">Blog</h1>
                <p className="mb-5 leading-7 text-gray-600 dark:text-dark-100">
                    Notes on backend engineering, distributed systems, and
                    things I&apos;m learning along the way.
                </p>
                <div className="relative">
                    <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full rounded-lg border border-light-800 bg-white/60 py-2.5 pl-10 pr-3 text-black outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 dark:border-dark-600 dark:bg-dark-700/40 dark:text-white"
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </section>

            <div className="mb-4 text-sm font-medium text-gray-400 dark:text-dark-200">
                {searchTerm
                    ? `${filteredPosts.length} result${
                          filteredPosts.length === 1 ? "" : "s"
                      }`
                    : "Latest posts"}
            </div>

            <div className="flex flex-col gap-3">
                {filteredPosts.map((post, i) => (
                    <motion.div
                        key={getSlug(post) || i}
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

            {filteredPosts.length === 0 && (
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
                        No posts found. Try a different search.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllPost;

export const getStaticProps = async () => {
    const response = await getAllPosts();

    return {
        props: {
            response,
        },
        revalidate: 60,
    };
};
