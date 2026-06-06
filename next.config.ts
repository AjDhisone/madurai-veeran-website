import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disable the X-Powered-By header for security */
  poweredByHeader: false,

  /* Keep canonical URLs without trailing slash */
  trailingSlash: false,

  /* React strict mode for catching potential issues */
  reactStrictMode: true,

  /* Image optimization — keep unoptimized for now */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
