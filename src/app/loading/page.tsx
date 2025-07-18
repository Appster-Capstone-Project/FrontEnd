
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart } from 'lucide-react';
import './loading.css';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const showSplash = localStorage.getItem('showSplash');
    const userRole = localStorage.getItem('userRole');

    const redirect = () => {
      // Clear the splash flag
      localStorage.removeItem('showSplash');
      // Redirect based on role
      if (userRole === 'seller') {
        router.replace('/sell');
      } else {
        router.replace('/dashboard');
      }
    };
    
    // Only show splash screen if the flag is set
    if (showSplash === 'true') {
        const timer = setTimeout(redirect, 3000); // Show splash for 3 seconds
        return () => clearTimeout(timer);
    } else {
        // If no flag, redirect immediately
        redirect();
    }

  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
      <div className="relative tiffin-box-container">
        <div className="tiffin-box">
          <div className="lid"></div>
          <div className="box"></div>
          <div className="handle"></div>
        </div>
        <div className="hearts">
          <Heart className="heart h1" />
          <Heart className="heart h2" />
          <Heart className="heart h3" />
          <Heart className="heart h4" />
          <Heart className="heart h5" />
        </div>
      </div>
      <h1 className="font-headline text-4xl font-bold mt-8 animate-fade-in-up">
        TiffinBox
      </h1>
    </div>
  );
}
