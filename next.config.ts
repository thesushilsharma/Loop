import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.uowdubai.ac.ae",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.aud.edu",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ku.ac.ae",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.zu.ac.ae",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true, // Enabling SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Additional security for SVGs
  },
};

export default nextConfig;
