import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/static/images/resume.pdf',
        destination: '/resume.pdf',
      },
    ];
  },
};

export default nextConfig;
