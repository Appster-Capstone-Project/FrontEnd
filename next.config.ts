
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
      {
        protocol: 'http',
        hostname: '20.185.241.50',
        port: '9000',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://20.185.241.50:8000/:path*', // your backend IP with port
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'http://20.185.241.50:8000',
  }
};

export default withPwa(nextConfig);

    