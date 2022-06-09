import React from "react";

import {
    AiOutlineSchedule,
    AiOutlineAppstore,
    AiOutlineSend,
    AiFillFacebook
} from "react-icons/ai";
import {
    FiBookOpen,
    FiCloud,
    FiFileText,
    FiHexagon,
    FiRss,
    FiZap,
} from "react-icons/fi";

import {
    SiGithub,
    SiMedium,
    SiSinaweibo,
    SiSteam,
    SiTelegram,
    SiTwitter,
} from "react-icons/si";
const projectLinks = [
    {
        name: "Scheduler-Kma",
        link: "https://github.com/kirilngusi/React_Scheduler-Kma",
        icon: FiFileText,
        slug: "kirilngusi/React_Scheduler-Kma",
    },
    {
        name: "Ecommerce",
        link: "https://github.com/kirilngusi/Nextjs-Ecommerce",
        icon: AiOutlineAppstore,
        slug: "kirilngusi/Nextjs-Ecommerce",
    },
];

const socialLinks = [
    {
        name: "GitHub",
        link: "https://github.com/kirilngusi",
        icon: SiGithub,
        apiUrl: "https://api.swo.moe/stats/github/kirilngusi",
        color: "#eeba30",
    },
    {
        name: "Twitter",
        link: "https://twitter.com/kiril0505",
        icon: SiTwitter,
        apiUrl: "https://api.swo.moe/stats/twitter/kiril0505",
        color: "#1da1f2",
    },
    {
        name: "Medium",
        link: "https://medium.com/tuan2k21211",
        icon: SiMedium,
        apiUrl: "https://api.swo.moe/stats/medium/tuan2k21211",
        color: "#00a669",
        followerName: "readers",
    },
    {
        name: "Facebook",
        link: "https://www.facebook.com/imkiril",
        icon: AiFillFacebook,
        apiUrl: "/",
        color: "#d71a1b",
        followerName: "readers",
    },
];

const ProjectCard = (props:any) => {
    return (
        <a href={props.link}>
            <div className="flex items-center justify-between  rounded border-b-4 bg-light-200 transition-all p-4 text-black hover:opacity-80 hover:shadow-lg dark:bg-dark-700">
                <div>
                    <h1 className="font-bold">{props.name}</h1>
                    <div className="font-mono text-sm">{props.name}</div>
                </div>

                <props.icon size={24} className="flex-shrink-0" />
            </div>
        </a>
    );
};

const LinkCard = (props:any) => {
    return (
        <a href={props.link}>
            <div
                className="flex items-center justify-between  rounded border-b-4 bg-light-200 transition-all p-4 text-black hover:opacity-80 hover:shadow-lg dark:bg-dark-700"
                style={{ borderBottomColor: props.color }}
            >
                <div>
                    <h1 className="font-bold">{props.name}</h1>
                    {/* <div className="font-mono text-sm">{props.slug}</div> */}
                </div>

                <props.icon size={24} className="" />
            </div>
        </a>
    );
};

const Projectsnsocials = () => {
    return (
        <div className="text-black m-auto max-w-3xl container px-6">
            <div className="font-serif text-4xl mb-8">Projects</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {projectLinks.map((project: any) => (
                    <ProjectCard key={project.slug} {...project} />
                ))}
            </div>

            <div className="mt-8 mb-8 text-4xl font-serif">Socials</div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {socialLinks.map((link: any) => (
                    <LinkCard key={link.name} {...link} />
                ))}
            </div>
        </div>
    );
};

export default Projectsnsocials;
