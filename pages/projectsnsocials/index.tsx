import React from "react";

import { AiOutlineSchedule, AiOutlineAppstore } from "react-icons/ai";

const projectLinks = [
    {
        name: "Scheduler-Kma",
        link: "https://github.com/kirilngusi/React_Scheduler-Kma",
        icon: AiOutlineSchedule,
        slug: "kirilngusi/React_Scheduler-Kma",
    },
    {
        name: "Ecommerce",
        link: "https://github.com/kirilngusi/Nextjs-Ecommerce",
        icon: AiOutlineAppstore,
        slug: "kirilngusi/Nextjs-Ecommerce",
    },
];

const ProjectCard = (props) => {
    return (
        <a href={props.link}>
            <div className="flex items-center justify-between  p-4">
                <div>
                    <div>
                      {props.name}
                    </div>
                    <div>
                      {props.slug}
                    </div>
                </div>

                <props.icon size={24} className="flex-shrink-0"/>
            </div>
        </a>
    );
};

const projectsnsocials = () => {
    return (
        <div className="text-white m-auto max-w-3xl container">
            <div className="font-serif text-4xl">Projects</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {projectLinks.map((project: any) => (
                    <ProjectCard key={project.slug} {...project} />
                ))}
            </div>

            <div className="text-4xl font-serif">Socials</div>
        </div>
    );
};

export default projectsnsocials;
