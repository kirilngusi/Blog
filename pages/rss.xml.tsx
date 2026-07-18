import { GetServerSideProps } from "next";

import { getAllPosts } from "../lib/notion";
import { toPostMeta, PostMeta } from "../lib/posts";
import { siteConfig } from "../lib/siteConfig";

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

const buildRss = () => {
    return async () => {
        const posts: PostMeta[] = (await getAllPosts()).map(toPostMeta);
        const items = posts
            .map((p) => {
                const url = `${siteConfig.url}/blog/${p.slug}`;
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
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
    };
};

const Rss = () => null;
export default Rss;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const xml = await buildRss()();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.write(xml);
    res.end();
    return { props: {} };
};
