/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Terser (webpack's default minifier on Next 12) can't parse the private
  // class fields that pdfjs-dist (a transitive dep of react-notion-x's Pdf
  // renderer) ships as of the notion-client/react-notion-x 8.x upgrade.
  // SWC's minifier understands modern syntax natively.
  swcMinify: true,
  // English lives at the unprefixed URLs, Vietnamese under /vi. Keep in sync
  // with LOCALES in lib/i18n.ts. No Accept-Language redirect: everyone lands
  // on English and switches to Vietnamese explicitly.
  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "en",
    localeDetection: false,
  },
}

module.exports = nextConfig
