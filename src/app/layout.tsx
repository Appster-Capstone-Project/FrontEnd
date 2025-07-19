
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/context/Providers';

export const metadata: Metadata = {
  title: 'TiffinBox',
  description: 'TiffinBox: Discover nearby home cooks and tiffin services. Browse menus, read reviews, and enjoy authentic homemade meals.',
  
  // Apple PWA Tags
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default',
  appleWebAppTitle: 'TiffinBox',
  
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/favicon.ico", // General favicon
    apple: "/icons/apple-touch-icon.png", // Apple touch icon
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
    { media: '(prefers-color-scheme: dark)', color: '#2A2A2A' }, 
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
        {/* Font links remain here as they are direct resource links */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* 
          Other meta tags (theme-color, viewport, apple-specific PWA tags) 
          are now primarily handled by the metadata objects exported above.
          Next.js injects these automatically.
          The manifest link will be injected by next-pwa.
        */}
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
