import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

const withPwa = withPWA({
  dest: '.next/pwa',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */ // Add your existing Next.js configuration options here
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.174.95.6:8080/:path*', // your backend IP
      },
    ];
  },
};

export default withPwa(nextConfig);
