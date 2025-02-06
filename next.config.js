/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      undici: false,
      http: false,
      https: false,
      url: false,
      stream: false,
      crypto: false,
      'node:crypto': false,
      'node:url': false,
      'node:util': false,
      'node:stream': false,
      'node:buffer': false,
      'node:http': false,
      'node:https': false
    };
    return config;
  },
};

module.exports = {
  experimental: {
    appDir: true,
  },
};