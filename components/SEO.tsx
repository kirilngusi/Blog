import Head from "next/head";
import { siteConfig } from "../lib/siteConfig";

interface SEOProps {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    type?: "website" | "article";
    publishedTime?: string;
    tags?: string[];
    noindex?: boolean;
}

const SEO = ({
    title,
    description = siteConfig.description,
    path = "/",
    image = siteConfig.ogImage,
    type = "website",
    publishedTime,
    tags,
    noindex = false,
}: SEOProps) => {
    const pageTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
    const url = `${siteConfig.url}${path}`;
    const absoluteImage = image.startsWith("http")
        ? image
        : `${siteConfig.url}${image}`;

    const jsonLd =
        type === "website" && path === "/"
            ? {
                  "@context": "https://schema.org",
                  "@type": "Person",
                  name: siteConfig.fullName,
                  alternateName: siteConfig.name,
                  url: siteConfig.url,
                  jobTitle: siteConfig.role,
                  email: `mailto:${siteConfig.email}`,
                  sameAs: Object.values(siteConfig.socials),
              }
            : null;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <meta name="author" content={siteConfig.author} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteConfig.name} />
            <meta property="og:image" content={absoluteImage} />
            {publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {tags?.map((tag) => (
                <meta property="article:tag" content={tag} key={tag} />
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
            <meta name="twitter:creator" content={siteConfig.twitterHandle} />

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
};

export default SEO;
