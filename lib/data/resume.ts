// Content sourced from CV (Vương Tuấn Anh / Kiril).

export const about = {
    headline: "Backend Engineer (Golang) · Distributed Systems",
    summary:
        "Software Engineer with 3+ years of experience, focused on backend development with Golang and distributed systems — building high-throughput data pipelines, microservices, and real-time processing on cloud infrastructure.",
    location: "Hanoi, Vietnam",
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

export const education = {
    school: "Academy Of Cryptography Techniques (KMA)",
    degree: "Bachelor of Engineering in Information Security",
    period: "Nov 2020 – Mar 2025",
    classification: "Good",
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
