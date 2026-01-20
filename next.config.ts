import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },
  async redirects() {
    return [
      { source: '/user/:username/:slug', destination: '/@:username/:slug', permanent: true },
      { source: '/user/:username', destination: '/@:username', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/@:username/:slug', destination: '/user/:username/:slug' },
      { source: '/@:username', destination: '/user/:username' },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
