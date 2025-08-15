
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart } from 'lucide-react';
import './loading.css';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    const redirect = () => {
      if (userRole === 'seller') {
        router.replace('/sell');
      } else {
        router.replace('/vendors');
      }
    };
    
    // Redirect immediately. The animation will show for the brief moment
    // it takes for the redirect to happen.
    redirect();

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
