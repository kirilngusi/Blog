import { GetServerSideProps } from "next";

import { getPostList } from "../lib/notion";
import { allTags, tagSlug } from "../lib/posts";
import { siteConfig } from "../lib/siteConfig";
import { DEFAULT_LOCALE, LOCALES, Locale, localePath, toLocale } from "../lib/i18n";

const staticPaths = ["/", "/blog", "/about", "/projectsnsocials"];

const urlEntry = (locale: Locale, path: string, lastmod?: string) => `  <url>
    <loc>${siteConfig.url}${localePath(locale, path)}</loc>${
        lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }
  </url>`;

const Sitemap = () => null;
export default Sitemap;

// A single sitemap covering both locales. Posts are listed only in the
// languages they were actually written in: an untranslated fallback page
// canonicalizes to the original, so it doesn't belong here.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const perLocale = await Promise.all(LOCALES.map((l) => getPostList(l)));
    const posts = perLocale[LOCALES.indexOf(DEFAULT_LOCALE)];

    const urls = [
        ...LOCALES.flatMap((l) => staticPaths.map((path) => urlEntry(l, path))),
        ...posts.flatMap((p) =>
            (p.availableLangs.length ? p.availableLangs : [DEFAULT_LOCALE]).map(
                (lang) => urlEntry(toLocale(lang), `/blog/${p.slug}`, p.date || undefined)
            )
        ),
        ...LOCALES.flatMap((l, i) =>
            allTags(perLocale[i]).map((t) => urlEntry(l, `/tags/${tagSlug(t)}`))
        ),
    ].join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.write(xml);
    res.end();
    return { props: {} };
};
