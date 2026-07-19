import type { NextPage } from "next";
import { useState } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";

import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiMail, FiArrowRight, FiFolder, FiBookOpen } from "react-icons/fi";

import SEO from "../components/SEO";
import Typewriter from "../components/Typewriter";
import { siteConfig } from "../lib/siteConfig";
import { about, experiences, skills, education } from "../lib/data/resume";

const HeroScene3D = dynamic(() => import("../components/HeroScene"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-dark-200">
            Loading 3D…
        </div>
    ),
});

const RoamingRobot3D = dynamic(() => import("../components/RoamingRobot"), {
    ssr: false,
});

const sectionTitle =
    "font-serif text-2xl font-bold text-black dark:text-white mb-6";
const tag =
    "rounded-full bg-accent-600/10 text-accent-700 dark:bg-accent-400/10 dark:text-accent-300 px-2.5 py-1 text-xs font-medium";
const iconLink =
    "flex items-center gap-2 rounded-lg border border-light-800 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300";

const Home: NextPage = () => {
    const [roam, setRoam] = useState(false);

    return (
        <>
            <SEO />

            {roam && <RoamingRobot3D onExit={() => setRoam(false)} />}

            <div className="mx-auto max-w-5xl px-6 text-black dark:text-dark-50">
                {/* Hero: 3D robot left, text right */}
                <section className="grid animate-fade-up items-center gap-10 py-6 lg:grid-cols-2 lg:py-8">
                    <div className="relative order-2 h-[320px] sm:h-[400px] lg:order-1">
                        {/* Roam is a desktop-only feature (hidden on mobile). */}
                        <button
                            type="button"
                            onClick={() => setRoam((v) => !v)}
                            className="absolute left-3 top-3 z-10 hidden items-center gap-1.5 rounded-lg border border-light-800 bg-white/70 px-3 py-1.5 text-xs font-medium text-gray-600 backdrop-blur transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:bg-dark-700/70 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300 sm:flex"
                        >
                            {roam ? "✕ Exit roam" : "🚶 Roam the page"}
                        </button>
                        {roam ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                <span className="animate-float text-4xl">🚶</span>
                                <p className="text-sm text-gray-500 dark:text-dark-200">
                                    Roaming the page…
                                </p>
                            </div>
                        ) : (
                            <HeroScene3D />
                        )}
                    </div>

                    <div className="order-1 lg:order-2">
                        <h1 className="text-4xl font-bold sm:text-5xl">
                            Hi, I&apos;m{" "}
                            <Typewriter
                                text="Kiril"
                                className="bg-gradient-to-r from-accent-500 to-cyan-400 bg-clip-text text-transparent"
                            />{" "}
                            <span className="inline-block origin-[70%_70%] animate-wave">
                                👋
                            </span>
                        </h1>

                        <p className="mb-4 mt-3 text-lg font-semibold text-accent-600 dark:text-accent-400">
                            {about.headline}
                        </p>

                        <p className="mb-6 leading-7 text-gray-600 dark:text-dark-100">
                            {about.summary}
                        </p>

                        <div className="flex flex-wrap gap-3">
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
                </section>

                {/* Content (kept narrow for readability) */}
                <div className="mx-auto max-w-3xl">
                    {/* Experience */}
                    <section className="mt-12">
                        <h2 className={sectionTitle}>Experience</h2>
                        <div className="flex flex-col gap-8 border-l border-light-800 pl-6 dark:border-dark-600">
                            {experiences.map((exp) => (
                                <div key={exp.company} className="relative">
                                    <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-500 ring-4 ring-white dark:ring-dark-800" />
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                        <h3 className="font-bold text-black dark:text-white">
                                            {exp.company}
                                        </h3>
                                        <span className="font-mono text-xs text-gray-500 dark:text-dark-200">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                                        {exp.role} · {exp.location}
                                    </p>
                                    {exp.stack && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {exp.stack.map((s) => (
                                                <span key={s} className={tag}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="mt-14">
                        <h2 className={sectionTitle}>Skills</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {skills.map((group) => (
                                <div
                                    key={group.group}
                                    className="rounded-xl border border-light-800 p-4 dark:border-dark-600"
                                >
                                    <div className="mb-2 text-sm font-semibold text-gray-500 dark:text-dark-200">
                                        {group.group}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((s) => (
                                            <span key={s} className={tag}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="mt-14">
                        <h2 className={sectionTitle}>Education</h2>
                        <div className="rounded-xl border border-light-800 p-5 dark:border-dark-600">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                <h3 className="font-bold text-black dark:text-white">
                                    {education.school}
                                </h3>
                                <span className="font-mono text-xs text-gray-500 dark:text-dark-200">
                                    {education.period}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-dark-100">
                                {education.degree} · Classification:{" "}
                                {education.classification}
                            </p>
                        </div>
                    </section>

                    {/* Explore */}
                    <section className="mb-16 mt-14">
                        <h2 className={sectionTitle}>Explore</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link href="/blog">
                                <a className="group flex items-center gap-3 rounded-xl border border-light-800 p-4 transition-colors hover:border-accent-500 dark:border-dark-600 dark:hover:border-accent-400">
                                    <FiBookOpen className="flex-shrink-0 text-accent-600 dark:text-accent-400" size={20} />
                                    <span className="flex-1 font-semibold text-black group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                                        Read the Blog
                                    </span>
                                    <FiArrowRight className="flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-600 dark:group-hover:text-accent-400" />
                                </a>
                            </Link>
                            <Link href="/projectsnsocials">
                                <a className="group flex items-center gap-3 rounded-xl border border-light-800 p-4 transition-colors hover:border-accent-500 dark:border-dark-600 dark:hover:border-accent-400">
                                    <FiFolder className="flex-shrink-0 text-accent-600 dark:text-accent-400" size={20} />
                                    <span className="flex-1 font-semibold text-black group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                                        Projects &amp; Socials
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
