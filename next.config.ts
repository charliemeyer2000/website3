import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.md": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/static/images/resume.pdf",
        destination: "/resume.pdf",
      },
    ];
  },
};

export default nextConfig;
