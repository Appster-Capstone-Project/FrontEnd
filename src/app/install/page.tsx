
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Share, PlusSquare } from 'lucide-react';

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  
  const handleInstallClick = () => {
    if (!deferredPrompt) {
        alert("To install the app, please follow the instructions for your browser below.");
        return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Mark as installed so we don't show this page again
        localStorage.setItem('tiffinbox_installed', 'true');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    });
  };

  const handleContinue = () => {
    // Mark as installed/visited so we don't show this page again
    localStorage.setItem('tiffinbox_installed', 'true');
  }

  // If already installed, just provide a link to the dashboard
  if (isStandalone) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
             <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="mx-auto mb-4">
                        <Image src="/icons/icon.svg" width={80} height={80} alt="TiffinBox Logo" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Welcome to TiffinBox!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">You have the app installed. Let's find some food!</p>
                    <Link href="/welcome" passHref>
                        <Button className="w-full">
                            Go to App <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-body">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4">
             <Image src="/icons/icon.svg" width={80} height={80} alt="TiffinBox Logo" />
           </div>
          <CardTitle className="font-headline text-2xl">Install TiffinBox</CardTitle>
          <p className="text-muted-foreground">For the best experience, add our app to your home screen.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {deferredPrompt && (
            <Button onClick={handleInstallClick} className="w-full" size="lg">
              Install App
            </Button>
          )}

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">For iPhone & iPad (Safari)</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap the <Share className="inline h-4 w-4 mx-1" /> icon in the browser menu.</li>
                <li>Scroll down and tap <span className="font-semibold">'Add to Home Screen'</span>.</li>
                <li>Tap 'Add' in the top right corner.</li>
              </ol>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">For Android (Chrome)</h3>
               <ol className="list-decimal list-inside space-y-1">
                <li>Tap the 'Install App' button above, or</li>
                <li>Tap the three dots ⋮ in the top right corner.</li>
                <li>Tap <span className="font-semibold">'Install app'</span> or <span className="font-semibold">'Add to Home screen'</span>.</li>
              </ol>
            </div>
          </div>
          
          <div className="text-center pt-4">
             <Link href="/welcome" onClick={handleContinue} className="text-sm text-primary hover:underline">
               Continue to website without installing <ArrowRight className="inline h-4 w-4" />
             </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
