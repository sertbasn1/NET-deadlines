import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/NET-deadlines",
        assetPrefix: "/NET-deadlines/",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
