import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@blocknote/server-util', '@blocknote/core'],

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
      { source: '/profile/:username/:slug', destination: '/@:username/:slug', permanent: true },
      { source: '/profile/:username', destination: '/@:username', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/@:username/:slug', destination: '/profile/:username/:slug' },
      { source: '/@:username', destination: '/profile/:username' },
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
