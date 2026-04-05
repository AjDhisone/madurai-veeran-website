import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export output for CDN/static hosts like Cloudflare Pages */
  output: 'export',

  /* Disable the X-Powered-By header for security */
  poweredByHeader: false,

  /* Keep canonical URLs without trailing slash */
  trailingSlash: false,

  /* React strict mode for catching potential issues */
  reactStrictMode: true,

  /* Required when using static export with Next image optimization disabled */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
