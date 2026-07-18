import React from "react";
import { NotionRenderer } from "react-notion-x";

import { getAllPosts, normalizeRecordMap } from "../../lib/notion";
import { toPostMeta, PostMeta, formatDate } from "../../lib/posts";
import { NotionAPI } from "notion-client";

import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Pdf } from "react-notion-x/build/third-party/pdf";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import SEO from "../../components/SEO";
import Comments from "../../components/Comments";
import { useTheme } from "../../lib/useTheme";

const Code = dynamic(async () => {
    const m = await import("react-notion-x/build/third-party/code");
    return m.Code;
});

const Modal = dynamic(
    async () => {
        const m = await import("react-notion-x/build/third-party/modal");
        return m.Modal;
    },
    { ssr: false }
);

const SinglePost = ({ blocks, meta }: { blocks: any; meta: PostMeta }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="mx-auto max-w-3xl px-6 lg:max-w-4xl">
            <SEO
                title={meta.title}
                description={meta.description}
                path={`/blog/${meta.slug}`}
                type="article"
                publishedTime={meta.date}
                tags={meta.tags}
            />

            <Link href="/blog">
                <a className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-accent-600 dark:text-dark-200 dark:hover:text-accent-400">
                    <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                    Back to blog
                </a>
            </Link>

            {/* Custom post header (replaces the raw Notion property table) */}
            <header className="mb-8 border-b border-light-800 pb-6 dark:border-dark-600">
                <h1 className="font-serif text-3xl font-bold text-black dark:text-white sm:text-4xl">
                    {meta.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-dark-200">
                    {meta.date && <time>{formatDate(meta.date)}</time>}
                    {meta.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {meta.tags.map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full bg-accent-600/10 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-400/10 dark:text-accent-300"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <NotionRenderer
                components={{ Code, Collection, Equation, Modal, Pdf }}
                recordMap={blocks}
                fullPage={true}
                darkMode={isDark}
                showTableOfContents={true}
                minTableOfContentsItems={3}
            />

            <Comments />

            <style jsx global>{`
                /* We render our own header, so hide Notion's title, cover and
                   property table. */
                .notion-header,
                .notion-title,
                .notion-page-cover-wrapper,
                .notion-collection-row {
                    display: none;
                }
                /* Blend the article with our page background instead of the
                   default Notion panel colour. */
                .notion,
                .notion-frame,
                .notion-page {
                    background: transparent !important;
                }
                .notion-frame main {
                    width: 100%;
                }
                .notion {
                    padding: 0;
                }
                .notion-page {
                    padding: 0 !important;
                    width: 100% !important;
                }
                .notion-aside-table-of-contents {
                    max-width: 250px;
                    background: inherit;
                }
                .notion-table-of-contents-item {
                    white-space: normal;
                    line-height: 1.25rem;
                    font-weight: normal;
                }

                /* --- Readability tuning --- */
                .notion-page {
                    font-size: 16.5px;
                }
                .notion-text {
                    line-height: 1.8;
                    padding: 0.35em 0;
                }
                .notion-h1,
                .notion-h2,
                .notion-h3 {
                    margin-top: 1.6em;
                    margin-bottom: 0.4em;
                    letter-spacing: -0.01em;
                }

                /* Light mode: darker body text for comfortable contrast */
                .notion-text,
                .notion-list,
                .notion-toggle {
                    color: #2b2f36;
                }

                /* Dark mode: brighter body/heading text, softer than pure white */
                html.dark .notion,
                html.dark .notion-text,
                html.dark .notion-list,
                html.dark .notion-toggle,
                html.dark .notion-table-of-contents-item {
                    color: #d7dee6;
                }
                html.dark .notion-h1,
                html.dark .notion-h2,
                html.dark .notion-h3,
                html.dark .notion-page-title-text {
                    color: #f2f6fa;
                }
                html.dark .notion-link,
                html.dark a.notion-link {
                    color: #4ade80;
                    border-bottom-color: rgba(74, 222, 128, 0.4);
                }
                html.dark .notion-inline-code {
                    background: rgba(255, 255, 255, 0.08);
                    color: #f8b5ff;
                }
                html.dark .notion-quote {
                    border-left-color: #34d399;
                    color: #c9d1d9;
                }
                html.dark .notion-callout {
                    background: rgba(255, 255, 255, 0.05);
                }
                html.dark .notion-hr {
                    border-color: rgba(255, 255, 255, 0.12);
                }
            `}</style>
        </div>
    );
};

export default SinglePost;

export const getStaticPaths = async () => {
    const allPosts = await getAllPosts();
    const slugMapping = allPosts.map((p: any) => {
        const slug = p.properties.slug.rich_text[0]?.plain_text?.toString();
        if (!slug) {
            // fallback to a 404-style path
            return { params: { slug: "404-not-found" } };
        }
        return { params: { slug: slug.trim() } };
    });
    return {
        paths: slugMapping,
        fallback: false,
    };
};

export const getStaticProps = async ({ params }: { params: any }) => {
    const db = await getAllPosts(params.slug);
    const post = db.find(
        (t: any) =>
            t.properties.slug.rich_text[0].text.content === params?.slug
    );

    if (!post) {
        return { notFound: true };
    }

    const meta = toPostMeta(post);
    const notion = new NotionAPI();
    const blocks = normalizeRecordMap(await notion.getPage(post.id));

    return {
        props: { blocks, meta },
        revalidate: 60,
    };
};
