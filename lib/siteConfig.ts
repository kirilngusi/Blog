export const siteConfig = {
    name: "Kiril",
    fullName: "Vương Tuấn Anh",
    title: "Kiril's Blog · KirilNgusi",
    role: "Backend Engineer (Golang)",
    description:
        "Notes on backend engineering, distributed systems and the things I'm learning along the way — a personal blog by Kiril (Vương Tuấn Anh / KirilNgusi).",
    // Name variants so searching any of these surfaces the site.
    alternateNames: ["KirilNgusi", "Kiril Ngusi", "Vương Tuấn Anh"],
    // Name variants stay first so searching any of them still surfaces the
    // site; the rest describe what gets written about here.
    keywords:
        "kirilngusi, KirilNgusi, Kiril, Vương Tuấn Anh, kiril blog, backend engineering blog, golang, distributed systems, microservices, Vietnam",
    url: "https://kirilngusi.vercel.app",
    ogImage: "/images/home.png",
    email: "vuongtuan1211@gmail.com",
    locale: "en",
    // Homepage voice. Deliberately not the CV summary — the landing page is a
    // blog, so it introduces the writing, not the résumé. Job titles, employers
    // and skill lists live on /about.
    blog: {
        eyebrow: "Welcome to the blog",
        heading: "Kiril's Blog",
        intro:
            "Hi, I'm Kiril (Tuan Anh). I write about the things I bump into while building backend systems - what broke, what I misread, and what finally clicked. Mostly notes to my future self, kept in the open in case they're useful to you too. Thanks for stopping by!",
    },
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
