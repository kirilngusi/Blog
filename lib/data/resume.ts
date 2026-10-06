// Content sourced from CV (Vương Tuấn Anh / Kiril). Prose is translated;
// names, roles, periods and stacks stay as they appear on the CV.

import { Locale } from "../i18n";

type Localized = Record<Locale, string>;

export const about: { headline: string; summary: Localized; location: Localized } = {
    headline: "Backend Engineer (Golang) · Distributed Systems",
    summary: {
        en: "Software Engineer with 3+ years of experience, focused on backend development with Golang and distributed systems — building high-throughput data pipelines, microservices, and real-time processing on cloud infrastructure.",
        vi: "Software Engineer với hơn 3 năm kinh nghiệm, tập trung vào backend với Golang và hệ thống phân tán — xây dựng data pipeline thông lượng cao, microservices và xử lý real-time trên hạ tầng cloud.",
    },
    location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" },
};

export interface Experience {
    company: string;
    role: string;
    period: string;
    location: string;
    stack?: string[];
}

export const experiences: Experience[] = [
    {
        company: "Viettel Cyber Security",
        role: "Backend Engineer (Golang)",
        period: "Oct 2025 – Present",
        location: "Hanoi, Vietnam",
        stack: ["Golang", "Kafka"],
    },
    {
        company: "OpenCommerce Group",
        role: "FullStack / Backend Engineer (Golang)",
        period: "Oct 2023 – Oct 2025",
        location: "Hanoi, Vietnam",
        stack: ["Golang", "Elasticsearch", "ClickHouse", "AWS S3", "Stripe"],
    },
    {
        company: "Tigren Solutions",
        role: "Front-End Developer",
        period: "Nov 2022 – Oct 2023",
        location: "Hanoi, Vietnam",
        stack: ["ReactJS", "PWA", "Magento 2", "GraphQL"],
    },
    {
        company: "SmileTech Digital Technology",
        role: "Front-End Intern",
        period: "Jul 2022 – Nov 2022",
        location: "Hanoi, Vietnam",
        stack: ["ReactJS", "NextJS", "Redux"],
    },
];

export const education: {
    school: string;
    degree: Localized;
    period: string;
    classification: Localized;
} = {
    school: "Academy Of Cryptography Techniques (KMA)",
    degree: {
        en: "Bachelor of Engineering in Information Security",
        vi: "Kỹ sư An toàn thông tin",
    },
    period: "Nov 2020 – Mar 2025",
    classification: { en: "Good", vi: "Khá" },
};

export const skills: { group: string; items: string[] }[] = [
    { group: "Languages", items: ["Golang", "Python", "PHP", "JavaScript"] },
    {
        group: "Frameworks",
        items: ["Django", "Symfony", "ReactJS", "NextJS", "VueJS", "NestJS"],
    },
    {
        group: "Databases",
        items: ["MySQL", "ClickHouse", "Redis", "Elasticsearch"],
    },
    { group: "Messaging", items: ["Kafka", "RabbitMQ", "gRPC"] },
    { group: "Cloud & DevOps", items: ["Kubernetes", "Docker", "AWS S3"] },
];
