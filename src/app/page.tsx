
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import './loading/loading.css';

export default function AppRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    const redirect = () => {
      if (token) {
        if (userRole === 'seller') {
          router.replace('/sell');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/welcome');
      }
    };
    
    // Redirect after a short delay to allow the animation to be seen
    const timer = setTimeout(redirect, 2500); 

    return () => clearTimeout(timer);
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
