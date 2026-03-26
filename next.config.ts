import type { NextConfig } from "next";

import { getShortUrlRedirects } from "./lib/short-url-redirects";

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
  redirects: async () => {
    return [
      ...getShortUrlRedirects(),
      {
        source: "/vimessage",
        destination: "https://github.com/charliemeyer2000/vimessage",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
