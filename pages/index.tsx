import type { NextPage } from "next";

import Typical from "react-typical";
import Link from "next/link";

import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiMail, FiArrowRight } from "react-icons/fi";

import SEO from "../components/SEO";
import JumpGame from "../components/JumpGame";
import FollowEyes from "../components/FollowEyes";
import { siteConfig } from "../lib/siteConfig";
import { about, experiences, skills, education } from "../lib/data/resume";

const sectionTitle =
    "font-serif text-2xl font-bold text-black dark:text-white mb-6";
const tag =
    "rounded-full bg-accent-600/10 text-accent-700 dark:bg-accent-400/10 dark:text-accent-300 px-2.5 py-1 text-xs font-medium";
const iconLink =
    "flex items-center gap-2 rounded-lg border border-light-800 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-600 dark:text-dark-100 dark:hover:border-accent-400 dark:hover:text-accent-300";

const Home: NextPage = () => {
    return (
        <>
            <SEO />

            <div className="mx-auto flex max-w-3xl flex-col px-6 text-black dark:text-dark-50">
                {/* Hero */}
                <section className="animate-fade-up">
                    <div className="mb-4 mt-6 flex items-center gap-4">
                        <FollowEyes />
                        <h1 className="text-4xl font-bold sm:text-5xl">
                            <Typical
                                steps={["Hi,", 1000, "Kiril Here 👏", 1000]}
                                loop={Infinity}
                                wrapper="span"
                            />
                        </h1>
                    </div>

                    <p className="mb-4 text-lg font-semibold text-accent-600 dark:text-accent-400">
                        {about.headline}
                    </p>

                    <p className="mb-6 leading-7 text-gray-600 dark:text-dark-100">
                        {about.summary}
                    </p>

                    <div className="mb-2 flex flex-wrap gap-3">
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

                    <JumpGame />
                </section>

                {/* Experience */}
                <section className="mt-14">
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

                {/* Links */}
                <section className="mb-16 mt-14 flex flex-wrap gap-4">
                    <Link href="/projectsnsocials">
                        <a className="group inline-flex items-center gap-1 font-semibold text-accent-600 hover:underline dark:text-accent-400">
                            Projects &amp; Socials
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </Link>
                    <Link href="/blog">
                        <a className="group inline-flex items-center gap-1 font-semibold text-accent-600 hover:underline dark:text-accent-400">
                            Read the Blog
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </Link>
                </section>
            </div>
        </>
    );
};

export default Home;
