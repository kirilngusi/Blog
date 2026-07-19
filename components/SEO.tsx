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

    const isHome = type === "website" && path === "/";
    const isArticle = type === "article";

    // Person schema (identity) on the homepage — helps name queries resolve.
    const personLd = isHome
        ? {
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.fullName,
              alternateName: [siteConfig.name, ...siteConfig.alternateNames],
              description: siteConfig.description,
              url: siteConfig.url,
              image: `${siteConfig.url}${siteConfig.ogImage}`,
              jobTitle: siteConfig.role,
              email: `mailto:${siteConfig.email}`,
              sameAs: Object.values(siteConfig.socials),
          }
        : null;

    const articleLd = isArticle
        ? {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title,
              description,
              image: absoluteImage,
              datePublished: publishedTime,
              dateModified: publishedTime,
              author: {
                  "@type": "Person",
                  name: siteConfig.fullName,
                  url: siteConfig.url,
              },
              publisher: { "@type": "Person", name: siteConfig.fullName },
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              keywords: tags?.join(", "),
          }
        : null;

    const breadcrumbLd = isArticle
        ? {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                  {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: siteConfig.url,
                  },
                  {
                      "@type": "ListItem",
                      position: 2,
                      name: "Blog",
                      item: `${siteConfig.url}/blog`,
                  },
                  {
                      "@type": "ListItem",
                      position: 3,
                      name: title,
                      item: url,
                  },
              ],
          }
        : null;

    const schemas = [personLd, articleLd, breadcrumbLd].filter(Boolean);

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={siteConfig.keywords} />
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
                <meta
                    property="article:published_time"
                    content={publishedTime}
                />
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

            {schemas.map((s, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
                />
            ))}
        </Head>
    );
};

export default SEO;
