export const siteConfig = {
    name: "Kiril",
    fullName: "Vương Tuấn Anh",
    title: "Kiril · KirilNgusi — Backend Engineer (Golang)",
    role: "Backend Engineer (Golang)",
    description:
        "Kiril (KirilNgusi) — Backend Engineer with 3+ years focused on Golang and distributed systems: high-throughput data pipelines, microservices, and real-time processing.",
    // Name variants so searching any of these surfaces the site.
    alternateNames: ["KirilNgusi", "Kiril Ngusi", "Vương Tuấn Anh"],
    keywords:
        "kirilngusi, KirilNgusi, Kiril, Vương Tuấn Anh, backend engineer, golang developer, distributed systems, microservices, Vietnam",
    url: "https://kirilngusi.vercel.app",
    ogImage: "/images/home.png",
    email: "vuongtuan1211@gmail.com",
    locale: "en",
    author: "Vương Tuấn Anh (Kiril / KirilNgusi)",
    // Google Search Console verification (HTML-tag method). Set via env so it
    // can change without a code commit — see NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.
    googleSiteVerification:
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "fIiKf12DOSdpCsm0rOx38e5et19rlOBo8yz9Yq7imFs",
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
