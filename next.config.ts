
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
        hostname: '52.255.203.119',
        port: '9000',
        pathname: '/**',
      },
       {
        protocol: 'http',
        hostname: '20.185.241.50',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.2.32',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '20.168.243.183',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themanual.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        // This rewrite is for general API calls, excluding our specific SSE route.
        // It's important to use a negative lookahead to avoid conflicts.
        source: '/api/((?!events/stream).*)',
        destination: 'http://20.168.243.183:8000/:1', 
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'http://20.168.243.183:8000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000',
  }
};

export default withPwa(nextConfig);
