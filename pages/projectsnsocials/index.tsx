import React from "react";

import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FiExternalLink, FiMail } from "react-icons/fi";
import { SiGithub, SiLinkedin, SiTwitter, SiFacebook } from "react-icons/si";

import SEO from "../../components/SEO";
import { siteConfig } from "../../lib/siteConfig";
import { projects, Project } from "../../lib/data/projects";

interface Social {
    name: string;
    link: string;
    icon: IconType;
    color: string;
}

const socials: Social[] = [
    { name: "GitHub", link: siteConfig.socials.github, icon: SiGithub, color: "#6e5494" },
    { name: "LinkedIn", link: siteConfig.socials.linkedin, icon: SiLinkedin, color: "#0a66c2" },
    { name: "Twitter", link: siteConfig.socials.twitter, icon: SiTwitter, color: "#1da1f2" },
    { name: "Facebook", link: siteConfig.socials.facebook, icon: SiFacebook, color: "#1877f2" },
    { name: "Email", link: `mailto:${siteConfig.email}`, icon: FiMail, color: "#059669" },
];

const ProjectCard = ({ project }: { project: Project }) => (
    <div className="group flex flex-col rounded-xl border border-light-800 p-5 transition-all hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-sm dark:border-dark-600 dark:hover:border-accent-400">
        <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="font-bold text-black group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
                {project.name}
            </h3>
            <project.icon
                size={22}
                className="mt-0.5 flex-shrink-0 text-gray-400 dark:text-dark-200"
            />
        </div>
        <p className="mb-4 flex-1 text-sm leading-6 text-gray-600 dark:text-dark-100">
            {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
            {project.tech.map((t) => (
                <span
                    key={t}
                    className="rounded-full bg-accent-600/10 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-400/10 dark:text-accent-300"
                >
                    {t}
                </span>
            ))}
            <div className="ml-auto flex gap-3 text-gray-500 dark:text-dark-200">
                {project.repo && (
                    <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} on GitHub`}
                        className="transition-colors hover:text-accent-600 dark:hover:text-accent-400"
                    >
                        <SiGithub size={18} />
                    </a>
                )}
                {project.live && (
                    <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} live site`}
                        className="transition-colors hover:text-accent-600 dark:hover:text-accent-400"
                    >
                        <FiExternalLink size={18} />
                    </a>
                )}
            </div>
        </div>
    </div>
);

const Projectsnsocials = () => {
    return (
        <div className="mx-auto max-w-3xl px-6 text-black dark:text-dark-50">
            <SEO
                title="Projects & Socials"
                description="Projects I've built and where to find me online."
                path="/projectsnsocials"
            />

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6 font-serif text-4xl font-bold"
            >
                Projects
            </motion.h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                        <ProjectCard project={project} />
                    </motion.div>
                ))}
            </div>

            <h2 className="mb-6 mt-14 font-serif text-3xl font-bold">
                Let&apos;s connect
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {socials.map((s, i) => (
                    <motion.a
                        key={s.name}
                        href={s.link}
                        target={s.link.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="flex items-center gap-3 rounded-xl border border-light-800 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:border-dark-600"
                        style={{ ["--brand" as any]: s.color }}
                    >
                        <s.icon
                            size={20}
                            className="flex-shrink-0"
                            style={{ color: s.color }}
                        />
                        <span className="font-medium text-black dark:text-white">
                            {s.name}
                        </span>
                    </motion.a>
                ))}
            </div>
        </div>
    );
};

export default Projectsnsocials;
