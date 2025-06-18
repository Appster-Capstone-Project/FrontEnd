import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'HomePalate',
  description: 'HomePalate: Discover nearby home cooks and tiffin services. Browse menus, read reviews, and enjoy authentic homemade meals.',
  manifest: '/manifest.json', // For PWA
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarKind: 'default',
  appleWebAppTitle: 'HomePalate',
  formatDetection: {
    telephone: false,
  },
  // It's good practice to also include icons here for various platforms,
  // though the manifest.json handles PWA icons primarily.
  icons: {
    icon: "/icons/favicon.ico", // Example, you'll need to create this
    apple: "/icons/apple-touch-icon.png", // Example, you'll need to create this
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* PWA specific meta tags moved to Metadata object for Next.js 13+ App Router */}
        {/* <link rel="manifest" href="/manifest.json" /> already handled by metadata.manifest */}
        {/* <meta name="theme-color" content="#F27405" /> will be handled by metadata.themeColor or can be explicit if needed */}
        <meta name="theme-color" content="#F27405" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#FFA500" media="(prefers-color-scheme: dark)" /> {/* Example dark theme color */}


        {/* Apple specific tags: Also can be part of metadata, but explicitly placing them here for clarity */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HomePalate" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" /> 
        {/* Add more apple-touch-icon sizes if needed, e.g., sizes="180x180" */}

      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
