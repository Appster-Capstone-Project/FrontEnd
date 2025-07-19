
"use client";

import './loading.css';
import { Heart } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="tiffin-box-container">
        <div className="tiffin-box">
          <div className="lid"></div>
          <div className="handle"></div>
          <div className="box"></div>
           <div className="hearts">
            <Heart className="heart h1" style={{'--scale': 0.6} as React.CSSProperties} />
            <Heart className="heart h2" style={{'--scale': 0.8} as React.CSSProperties} />
            <Heart className="heart h3" style={{'--scale': 0.5} as React.CSSProperties} />
            <Heart className="heart h4" style={{'--scale': 0.7} as React.CSSProperties} />
            <Heart className="heart h5" style={{'--scale': 0.9} as React.CSSProperties} />
          </div>
        </div>
      </div>
      <h1 className="font-headline text-2xl font-bold mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        HomePalate
      </h1>
      <p className="text-muted-foreground mt-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        Loading deliciousness...
      </p>
    </div>
  );
}
