import { GetServerSideProps } from "next";

import { getPostList } from "../lib/notion";
import { PostMeta } from "../lib/posts";
import { siteConfig } from "../lib/siteConfig";
import { Locale, getDict, localePath, toLocale } from "../lib/i18n";

const escapeXml = (unsafe: string) =>
    unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            default:
                return "&quot;";
        }
    });

// One feed per locale (/rss.xml, /vi/rss.xml). Untranslated posts are
// included like on the site, linked at their original language's URL.
const buildRss = (locale: Locale) => {
    return async () => {
        const posts: PostMeta[] = await getPostList(locale);
        const items = posts
            .map((p) => {
                const postLocale = p.lang ? toLocale(p.lang) : locale;
                const url = `${siteConfig.url}${localePath(postLocale, `/blog/${p.slug}`)}`;
                const pubDate = p.date
                    ? new Date(p.date).toUTCString()
                    : new Date().toUTCString();
                return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.description)}</description>
${p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
            })
            .join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}${localePath(locale, "/blog")}</link>
    <description>${escapeXml(getDict(locale).siteDescription)}</description>
    <language>${locale}</language>
    <atom:link href="${siteConfig.url}${localePath(locale, "/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
    };
};

const Rss = () => null;
export default Rss;

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
    const xml = await buildRss(toLocale(locale))();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.write(xml);
    res.end();
    return { props: {} };
};
