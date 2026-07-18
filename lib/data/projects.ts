import { IconType } from "react-icons";
import { SiReact, SiNextdotjs } from "react-icons/si";

export interface Project {
    name: string;
    description: string;
    tech: string[];
    repo?: string;
    live?: string;
    icon: IconType;
}

export const projects: Project[] = [
    {
        name: "React Scheduler — KMA",
        description:
            "A class-scheduling web app for Academy of Cryptography Techniques students.",
        tech: ["ReactJS"],
        repo: "https://github.com/kirilngusi/React_Scheduler-Kma",
        icon: SiReact,
    },
    {
        name: "Next.js E-commerce",
        description:
            "A full-stack e-commerce storefront built with Next.js and React.",
        tech: ["Next.js", "React"],
        repo: "https://github.com/kirilngusi/Nextjs-Ecommerce",
        icon: SiNextdotjs,
    },
];
