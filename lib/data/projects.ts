import { IconType } from "react-icons";
import { SiReact, SiNextdotjs } from "react-icons/si";

import { Locale } from "../i18n";

export interface Project {
    name: string;
    description: Record<Locale, string>;
    tech: string[];
    repo?: string;
    live?: string;
    icon: IconType;
}

export const projects: Project[] = [
    {
        name: "React Scheduler — KMA",
        description: {
            en: "A class-scheduling web app for Academy of Cryptography Techniques students.",
            vi: "Ứng dụng web xếp lịch học cho sinh viên Học viện Kỹ thuật Mật mã.",
        },
        tech: ["ReactJS"],
        repo: "https://github.com/kirilngusi/React_Scheduler-Kma",
        icon: SiReact,
    },
    {
        name: "Next.js E-commerce",
        description: {
            en: "A full-stack e-commerce storefront built with Next.js and React.",
            vi: "Website thương mại điện tử full-stack xây dựng bằng Next.js và React.",
        },
        tech: ["Next.js", "React"],
        repo: "https://github.com/kirilngusi/Nextjs-Ecommerce",
        icon: SiNextdotjs,
    },
];
