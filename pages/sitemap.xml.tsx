import { GetServerSideProps } from "next";

import { getAllPosts } from "../lib/notion";
import { toPostMeta, PostMeta } from "../lib/posts";
import { siteConfig } from "../lib/siteConfig";

const staticPaths = ["", "/blog", "/projectsnsocials"];

const Sitemap = () => null;
export default Sitemap;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const posts: PostMeta[] = (await getAllPosts()).map(toPostMeta);

    const urls = [
        ...staticPaths.map(
            (path) => `  <url>
    <loc>${siteConfig.url}${path}</loc>
  </url>`
        ),
        ...posts.map(
            (p) => `  <url>
    <loc>${siteConfig.url}/blog/${p.slug}</loc>${
                p.date ? `\n    <lastmod>${p.date}</lastmod>` : ""
            }
  </url>`
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
