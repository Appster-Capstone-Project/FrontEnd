
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'HomePalate',
  description: 'HomePalate: Discover nearby home cooks and tiffin services. Browse menus, read reviews, and enjoy authentic homemade meals.',
  manifest: '/manifest.json', // For PWA
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  
  // Apple PWA Tags
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default', // Corrected property name
  appleWebAppTitle: 'HomePalate',
  
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/favicon.ico", // General favicon
    apple: "/icons/apple-touch-icon.png", // Apple touch icon
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F27405' },
    { media: '(prefers-color-scheme: dark)', color: '#2A2A2A' }, // Updated dark theme to be consistent with globals.css dark bg
  ],
};

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
          Other meta tags (manifest, theme-color, viewport, apple-specific PWA tags) 
          are now primarily handled by the `metadata` object exported above.
          Next.js injects these automatically.
        */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
