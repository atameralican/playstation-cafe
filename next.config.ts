import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hftwadbzxuaxhjzidagt.supabase.co',
        pathname: '/storage/v1/object/public/oyun-gorselleri/**',
      },
    ],
  },
};

export default nextConfig;
