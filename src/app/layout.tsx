
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/context/Providers';
import Loading from './loading'; // Import the loading component
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'HomePalate',
  description: 'HomePalate: Discover nearby home cooks and tiffin services. Browse menus, read reviews, and enjoy authentic homemade meals.',
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon.svg", 
    apple: "/icons/apple-touch-icon.png", 
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F27405' },
    { media: '(prefers-color-scheme: dark)', color: '#F27405' }, 
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font links */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* --- PWA-specific meta tags --- */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HomePalate" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        {/* --- iOS Splash Screen --- */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

      </head>
      <body className="font-body antialiased">
        <Providers>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
