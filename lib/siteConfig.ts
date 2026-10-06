export const siteConfig = {
    name: "Kiril",
    fullName: "Vương Tuấn Anh",
    title: "Kiril's Blog · KirilNgusi",
    role: "Backend Engineer (Golang)",
    // Name variants so searching any of these surfaces the site.
    alternateNames: ["KirilNgusi", "Kiril Ngusi", "Vương Tuấn Anh"],
    // Name variants stay first so searching any of them still surfaces the
    // site; the rest describe what gets written about here.
    keywords:
        "kirilngusi, KirilNgusi, Kiril, Vương Tuấn Anh, kiril blog, backend engineering blog, golang, distributed systems, microservices, Vietnam",
    url: "https://kirilngusi.vercel.app",
    ogImage: "/images/home.png",
    email: "vuongtuan1211@gmail.com",
    // Locale settings and all translated copy (homepage voice included) live
    // in lib/i18n.ts.
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
