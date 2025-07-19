
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import './loading/loading.css';

const TiffinLoader = () => (
  <div className="tiffin-box-container">
    <div className="tiffin-box">
      <div className="handle"></div>
      <div className="lid"></div>
      <div className="box"></div>
      <div className="hearts">
        <Heart className="heart h1" style={{ '--scale': 0.6 } as React.CSSProperties} />
        <Heart className="heart h2" style={{ '--scale': 0.8 } as React.CSSProperties} />
        <Heart className="heart h3" style={{ '--scale': 0.5 } as React.CSSProperties} />
        <Heart className="heart h4" style={{ '--scale': 0.7 } as React.CSSProperties} />
        <Heart className="heart h5" style={{ '--scale': 0.9 } as React.CSSProperties} />
      </div>
    </div>
    <p className="mt-8 text-xl font-headline text-primary animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      TiffinBox
    </p>
  </div>
);


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
    
    // Redirect after a delay to show the animation
    const timer = setTimeout(redirect, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount

  }, [router]);

  // Return a simple loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
        <TiffinLoader />
    </div>
  );
}
