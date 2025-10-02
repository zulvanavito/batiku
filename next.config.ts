import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "batiku-generated-images-zulvanavito-2025.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/generated/**",
      },
    ],
  },
};

export default nextConfig;
