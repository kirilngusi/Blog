import { useRouter } from "next/router";

export const LOCALES = ["en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const toLocale = (value?: string): Locale =>
    (LOCALES as readonly string[]).includes(value ?? "")
        ? (value as Locale)
        : DEFAULT_LOCALE;

// Each language named in itself — what the language switcher shows.
export const NATIVE_NAMES: Record<Locale, string> = {
    en: "English",
    vi: "Tiếng Việt",
};

export const OG_LOCALES: Record<Locale, string> = {
    en: "en_US",
    vi: "vi_VN",
};

export const DATE_LOCALES: Record<Locale, string> = {
    en: "en-US",
    vi: "vi-VN",
};

// Path as Next serves it for `locale`: the default locale is unprefixed.
export const localePath = (locale: Locale, path: string): string =>
    locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const en = {
    langName: { en: "English", vi: "Vietnamese" } as Record<Locale, string>,
    switchLanguage: "Switch language",
    siteDescription:
        "Notes on backend engineering, distributed systems and the things I'm learning along the way — a personal blog by Kiril (Vương Tuấn Anh / KirilNgusi).",
    nav: {
        blog: "Blog",
        about: "About",
        projects: "Projects & Socials",
        projectsShort: "Projects",
    },
    // Homepage voice. Deliberately not the CV summary — the landing page is a
    // blog, so it introduces the writing, not the résumé. Job titles, employers
    // and skill lists live on /about.
    home: {
        eyebrow: "Welcome to the blog",
        heading: "Kiril's Blog",
        intro: "Hi, I'm Kiril (Tuan Anh). I write about the things I bump into while building backend systems - what broke, what I misread, and what finally clicked. Mostly notes to my future self, kept in the open in case they're useful to you too. Thanks for stopping by!",
        // Noun only: the page renders the count itself, in bold.
        articles: (n: number): string => (n === 1 ? "article" : "articles"),
        tags: (n: number): string => (n === 1 ? "tag" : "tags"),
        loading3d: "Loading 3D…",
        roamStart: "🚶 Roam the page",
        roamExit: "✕ Exit roam",
        roaming: "Roaming the page…",
        latestPosts: "Latest posts",
        viewAll: "View all posts",
        noPosts: "No posts published yet — check back soon.",
        elsewhere: "Elsewhere",
        aboutMe: "About me",
    },
    blog: {
        title: "Blog",
        description:
            "Notes on backend engineering, distributed systems, and things I'm learning along the way.",
        searchPlaceholder: "Search posts...",
        clearSearch: "Clear search",
        allTags: "All",
        results: (n: number) => plural(n, "result"),
        posts: (n: number) => plural(n, "post"),
        noResults: "No posts found. Try a different search or tag.",
    },
    post: {
        backToBlog: "Back to blog",
        minRead: (n: number) => `${n} min read`,
        older: "Older",
        newer: "Newer",
        related: "Related posts",
        onlyIn: (lang: string) => `This post is only available in ${lang}.`,
    },
    tags: {
        title: (tag: string) => `Posts tagged ${tag}`,
        description: (tag: string) => `Posts about ${tag}.`,
        allPosts: "All posts",
    },
    about: {
        title: "About",
        experience: "Experience",
        skills: "Skills",
        education: "Education",
        classification: "Classification",
    },
    projects: {
        description: "Projects I've built and where to find me online.",
        heading: "Projects",
        connect: "Let's connect",
        onGithub: (name: string) => `${name} on GitHub`,
        liveSite: (name: string) => `${name} live site`,
    },
    scene: {
        wave: "Wave",
        dance: "Dance",
        jump: "Jump",
        love: "Love",
        up: "Up",
        left: "Left",
        right: "Right",
        down: "Down",
        moveHint: "move",
        jumpHint: "jump",
        roamHint: "roam",
        exitRoam: "Return",
    },
    notFound: {
        title: "404 — Not Found",
        description: "This page wandered off. Let's get you back.",
        heading: "This page got lost in space",
        sub: "The robot couldn't find what you were looking for.",
        home: "Go home",
        readBlog: "Read the blog",
    },
};

export type Dict = typeof en;

const vi: Dict = {
    langName: { en: "Tiếng Anh", vi: "Tiếng Việt" },
    switchLanguage: "Đổi ngôn ngữ",
    siteDescription:
        "Ghi chép về backend engineering, hệ thống phân tán và những thứ mình học được trên đường đi — blog cá nhân của Kiril (Vương Tuấn Anh / KirilNgusi).",
    nav: {
        blog: "Blog",
        about: "Giới thiệu",
        projects: "Dự án & Mạng xã hội",
        projectsShort: "Dự án",
    },
    home: {
        eyebrow: "Chào mừng đến với blog",
        heading: "Kiril's Blog",
        intro: "Chào bạn, mình là Kiril (Tuấn Anh). Mình viết về những thứ mình va phải khi xây dựng hệ thống backend - chỗ nào hỏng, chỗ nào mình hiểu sai, và lúc nào thì mọi thứ cuối cùng cũng thông. Phần lớn là ghi chú cho chính mình sau này, để công khai phòng khi nó cũng có ích cho bạn. Cảm ơn bạn đã ghé qua!",
        articles: () => "bài viết",
        tags: () => "chủ đề",
        loading3d: "Đang tải 3D…",
        roamStart: "🚶 Dạo quanh trang",
        roamExit: "✕ Thoát",
        roaming: "Đang dạo quanh trang…",
        latestPosts: "Bài viết mới nhất",
        viewAll: "Xem tất cả bài viết",
        noPosts: "Chưa có bài viết nào — quay lại sau nhé.",
        elsewhere: "Xem thêm",
        aboutMe: "Về mình",
    },
    blog: {
        title: "Blog",
        description:
            "Ghi chép về backend engineering, hệ thống phân tán và những thứ mình đang học.",
        searchPlaceholder: "Tìm bài viết...",
        clearSearch: "Xoá tìm kiếm",
        allTags: "Tất cả",
        results: (n: number) => `${n} kết quả`,
        posts: (n: number) => `${n} bài viết`,
        noResults: "Không tìm thấy bài viết nào. Thử từ khoá hoặc chủ đề khác.",
    },
    post: {
        backToBlog: "Quay lại blog",
        minRead: (n: number) => `${n} phút đọc`,
        older: "Cũ hơn",
        newer: "Mới hơn",
        related: "Bài viết liên quan",
        onlyIn: (lang: string) => `Bài viết này hiện chỉ có bằng ${lang}.`,
    },
    tags: {
        title: (tag: string) => `Bài viết về ${tag}`,
        description: (tag: string) => `Các bài viết về ${tag}.`,
        allPosts: "Tất cả bài viết",
    },
    about: {
        title: "Giới thiệu",
        experience: "Kinh nghiệm",
        skills: "Kỹ năng",
        education: "Học vấn",
        classification: "Xếp loại",
    },
    projects: {
        description: "Những dự án mình đã làm và nơi bạn có thể tìm thấy mình.",
        heading: "Dự án",
        connect: "Kết nối với mình",
        onGithub: (name: string) => `${name} trên GitHub`,
        liveSite: (name: string) => `Trang chạy thật của ${name}`,
    },
    scene: {
        wave: "Vẫy tay",
        dance: "Nhảy múa",
        jump: "Bật nhảy",
        love: "Thả tim",
        up: "Lên",
        left: "Trái",
        right: "Phải",
        down: "Xuống",
        moveHint: "di chuyển",
        jumpHint: "nhảy",
        roamHint: "dạo",
        exitRoam: "Quay lại",
    },
    notFound: {
        title: "404 — Không tìm thấy",
        description: "Trang này đi lạc mất rồi. Để mình đưa bạn về.",
        heading: "Trang này lạc vào vũ trụ mất rồi",
        sub: "Robot không tìm thấy thứ bạn đang tìm.",
        home: "Về trang chủ",
        readBlog: "Đọc blog",
    },
};

const DICTS: Record<Locale, Dict> = { en, vi };

export const getDict = (locale?: string): Dict => DICTS[toLocale(locale)];

export const useLocale = (): Locale => toLocale(useRouter().locale);

export const useT = (): Dict => DICTS[useLocale()];
