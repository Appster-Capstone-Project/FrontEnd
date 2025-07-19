
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HomePalate',
  description:
    'HomePalate: Discover nearby home cooks and tiffin services. Browse menus, read reviews, and enjoy authentic homemade meals.',
  manifest: '/manifest.webmanifest',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon.svg', // Main icon
    apple: '/icons/apple-touch-icon.png', // Apple touch icon
  },
};
