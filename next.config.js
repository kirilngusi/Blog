/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Terser (webpack's default minifier on Next 12) can't parse the private
  // class fields that pdfjs-dist (a transitive dep of react-notion-x's Pdf
  // renderer) ships as of the notion-client/react-notion-x 8.x upgrade.
  // SWC's minifier understands modern syntax natively.
  swcMinify: true,
}

module.exports = nextConfig
