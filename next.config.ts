import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Workspace packages ship raw TypeScript (exports point at src/*.ts), so Next
  // must transpile them rather than expect pre-built JS.
  transpilePackages: ["@workspace/db", "@workspace/api-client-react", "@workspace/api-zod"],
  images: {
    // NOTE: albums/products/news currently store no external image URLs — every
    // coverUrl/imageUrl/thumbnailUrl in the seed is null or a local /images/*
    // asset. The only external host rendered via next/image is Google account
    // avatars from the portal Google sign-in. Add hosts here when Tom sets
    // external cover/image URLs through the admin CRUD (§6).
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
