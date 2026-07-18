export const siteConfig = {
    name: "Kiril",
    fullName: "Vương Tuấn Anh",
    title: "Kiril — Software Engineer",
    role: "Backend Engineer (Golang)",
    description:
        "Software Engineer with 3+ years of experience, focused on backend development with Golang and distributed systems — high-throughput data pipelines, microservices, and real-time processing.",
    url: "https://kirilngusi.vercel.app",
    ogImage: "/images/home.png",
    email: "vuongtuan1211@gmail.com",
    locale: "en",
    author: "Vương Tuấn Anh (Kiril)",
    socials: {
        github: "https://github.com/kirilngusi",
        linkedin: "https://www.linkedin.com/in/tuananhvuong02/",
        twitter: "https://twitter.com/kiril0505",
        facebook: "https://www.facebook.com/imkiril",
    },
    twitterHandle: "@kiril0505",
    // Giscus comments (GitHub-login based). Fill these from https://giscus.app
    // after enabling Discussions on a public repo and installing the giscus app.
    // Leave repoId empty to show a setup hint instead of the widget.
    giscus: {
        repo: "kirilngusi/Blog" as `${string}/${string}`,
        repoId: "R_kgDOHbGiJg",
        category: "Announcements",
        categoryId: "DIC_kwDOHbGiJs4DBcPH",
    },
} as const;
