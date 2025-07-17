
import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

const withPwa = withPWA({
  dest: '.next/pwa',
  register: true,
  skipWaiting: true,
  disable: false, // Ensure PWA is active in development
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
        destination: 'http://172.191.27.147/:path*', // your backend IP with port
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  }
};

export default withPwa(nextConfig);
