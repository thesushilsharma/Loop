import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "www.uowdubai.ac.ae",
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true, // Enabling SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Additional security for SVGs
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
