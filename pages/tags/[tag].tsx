import React from "react";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import SEO from "../../components/SEO";
import PostCard from "../../components/PostCard";
import { getPostList } from "../../lib/notion";
import { PostMeta, allTags, tagSlug } from "../../lib/posts";

const TagPage = ({
    posts,
    tagName,
    slug,
}: {
    posts: PostMeta[];
    tagName: string;
    slug: string;
}) => (
    <div className="mx-auto max-w-3xl px-6 text-black dark:text-dark-50">
        <SEO
            title={`Posts tagged ${tagName}`}
            description={`Posts about ${tagName}.`}
            path={`/tags/${slug}`}
        />

        <Link href="/blog">
            <a className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-accent-600 dark:text-dark-200 dark:hover:text-accent-400">
                <FiArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
                All posts
            </a>
        </Link>

        <h1 className="mb-2 font-serif text-4xl font-bold">
            <span className="text-accent-600 dark:text-accent-400">#</span>
            {tagName}
        </h1>
        <div className="mb-6 text-sm font-medium text-gray-400 dark:text-dark-200">
            {posts.length} post{posts.length === 1 ? "" : "s"}
        </div>

        <div className="mb-16 flex flex-col gap-3">
            {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
            ))}
        </div>
    </div>
);

export default TagPage;

export const getStaticPaths = async () => {
    const posts = await getPostList();

    return {
        paths: allTags(posts).map((t) => ({ params: { tag: tagSlug(t) } })),
        fallback: false,
    };
};

export const getStaticProps = async ({ params }: { params: any }) => {
    const posts = await getPostList();
    const slug = params?.tag;

    // Match on the slugified form, but display the original Notion tag text.
    const tagName = allTags(posts).find((t) => tagSlug(t) === slug);

    if (!tagName) {
        return { notFound: true };
    }

    return {
        props: {
            posts: posts.filter((p) => p.tags.some((t) => tagSlug(t) === slug)),
            tagName,
            slug,
        },
        revalidate: 60,
    };
};
