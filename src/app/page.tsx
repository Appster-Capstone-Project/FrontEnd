
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if the PWA has been launched before
    const isInstalled = localStorage.getItem('tiffinbox_installed') === 'true';

    const redirect = () => {
      // If there's a token, the user is logged in
      if (token) {
        if (userRole === 'seller') {
          router.replace('/sell');
        } else {
          router.replace('/dashboard');
        }
      } 
      // If no token and not marked as installed, show the install page
      else if (!isInstalled) {
         router.replace('/install');
      }
      // If no token but has been "installed" or visited before, go to welcome
      else {
        router.replace('/welcome');
      }
    };
    
    // Redirect immediately
    redirect();

  }, [router]);

  // Return a simple loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
    </div>
  );
}
