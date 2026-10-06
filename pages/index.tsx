import type { NextPage } from "next";
import { useState } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";

import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiMail, FiArrowRight, FiFolder, FiUser } from "react-icons/fi";

import SEO from "../components/SEO";
import PostCard from "../components/PostCard";
import { siteConfig } from "../lib/siteConfig";
import { getPostList } from "../lib/notion";
import { PostMeta, allTags } from "../lib/posts";
import { toLocale, useT } from "../lib/i18n";

const Loading3D = () => {
    const t = useT();
    return (
        <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-dark-200">
            {t.home.loading3d}
        </div>
    );
};

const HeroScene3D = dynamic(() => import("../components/HeroScene"), {
    ssr: false,
    loading: () => <Loading3D />,
});

const RoamingRobot3D = dynamic(() => import("../components/RoamingRobot"), {
    ssr: false,
});

const LATEST_COUNT = 5;

const sectionTitle =
    "font-serif text-2xl font-bold text-black dark:text-white mb-6";
const iconLink =
    "flex items-center gap-2 rounded-lg border border-light-800 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300";

const Home: NextPage<{
    posts: PostMeta[];
    postCount: number;
    tagCount: number;
}> = ({ posts, postCount, tagCount }) => {
    const [roam, setRoam] = useState(false);
    const t = useT();

    return (
        <>
            <SEO />

            {roam && <RoamingRobot3D onExit={() => setRoam(false)} />}

            <div className="mx-auto max-w-5xl px-6 text-black dark:text-dark-50">
                {/* Hero: blog intro left, 3D robot right */}
                <section className="grid animate-fade-up items-center gap-10 py-6 lg:grid-cols-2 lg:py-10">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-600 dark:text-accent-400">
                            {t.home.eyebrow}
                        </p>

                        <h1 className="font-serif text-5xl font-bold leading-[1.05] sm:text-6xl">
                            {t.home.heading}
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-dark-100">
                            {t.home.intro}
                        </p>

                        <div className="mt-7 flex items-center gap-3 text-sm text-gray-500 dark:text-dark-200">
                            <span>
                                <strong className="font-bold text-black dark:text-white">
                                    {postCount}
                                </strong>{" "}
                                {t.home.articles(postCount)}
                            </span>
                            <span aria-hidden>·</span>
                            <span>
                                <strong className="font-bold text-black dark:text-white">
                                    {tagCount}
                                </strong>{" "}
                                {t.home.tags(tagCount)}
                            </span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href={siteConfig.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={iconLink}
                            >
                                <SiGithub size={16} /> GitHub
                            </a>
                            <a
                                href={siteConfig.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={iconLink}
                            >
                                <SiLinkedin size={16} /> LinkedIn
                            </a>
                            <a
                                href={`mailto:${siteConfig.email}`}
                                className={iconLink}
                            >
                                <FiMail size={16} /> Email
                            </a>
                        </div>
                    </div>

                    <div className="relative h-[320px] sm:h-[400px]">
                        {/* Roam is a desktop-only feature (hidden on mobile). */}
                        <button
                            type="button"
                            onClick={() => setRoam((v) => !v)}
                            className="absolute left-3 top-3 z-10 hidden items-center gap-1.5 rounded-lg border border-light-800 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-600 backdrop-blur transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:bg-dark-700/70 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300 sm:flex"
                        >
                            {roam ? t.home.roamExit : t.home.roamStart}
                        </button>
                        {roam ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                <span className="animate-float text-4xl">🚶</span>
                                <p className="text-sm text-gray-500 dark:text-dark-200">
                                    {t.home.roaming}
                                </p>
                            </div>
                        ) : (
                            <HeroScene3D />
                        )}
                    </div>
                </section>

                {/* Content (kept narrow for readability) */}
                <div className="mx-auto max-w-3xl">
                    {/* Latest posts */}
                    <section className="mt-10 border-t border-light-800 pt-12 dark:border-dark-600">
                        <h2 className={sectionTitle}>{t.home.latestPosts}</h2>

                        {posts.length > 0 ? (
                            <>
                                <div className="flex flex-col gap-3">
                                    {posts.map((post) => (
                                        <PostCard key={post.slug} post={post} />
                                    ))}
                                </div>

                                <Link href="/blog">
                                    <a className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300">
                                        {t.home.viewAll}
                                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </a>
                                </Link>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-dark-200">
                                {t.home.noPosts}
                            </p>
                        )}
                    </section>

                    {/* Elsewhere */}
                    <section className="mb-16 mt-14">
                        <h2 className={sectionTitle}>{t.home.elsewhere}</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link href="/about">
                                <a className="group flex items-center gap-3 rounded-xl border border-light-800 p-4 transition-colors hover:border-accent-500 dark:border-dark-600 dark:hover:border-accent-400">
                                    <FiUser
                                        className="flex-shrink-0 text-accent-600 dark:text-accent-400"
                                        size={20}
                                    />
                                    <span className="flex-1 font-semibold text-black group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                                        {t.home.aboutMe}
                                    </span>
                                    <FiArrowRight className="flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-600 dark:group-hover:text-accent-400" />
                                </a>
                            </Link>
                            <Link href="/projectsnsocials">
                                <a className="group flex items-center gap-3 rounded-xl border border-light-800 p-4 transition-colors hover:border-accent-500 dark:border-dark-600 dark:hover:border-accent-400">
                                    <FiFolder
                                        className="flex-shrink-0 text-accent-600 dark:text-accent-400"
                                        size={20}
                                    />
                                    <span className="flex-1 font-semibold text-black group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                                        {t.nav.projects}
                                    </span>
                                    <FiArrowRight className="flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-600 dark:group-hover:text-accent-400" />
                                </a>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Home;

export const getStaticProps = async ({ locale }: { locale?: string }) => {
    const all = await getPostList(toLocale(locale));

    return {
        props: {
            posts: all.slice(0, LATEST_COUNT),
            postCount: all.length,
            tagCount: allTags(all).length,
        },
        revalidate: 60,
    };
};
