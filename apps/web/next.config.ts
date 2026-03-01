import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@journeyman/shared'],
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
  ],
};

export default nextConfig;
