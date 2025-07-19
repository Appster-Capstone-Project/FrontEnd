
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Share, PlusSquare, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // If the app is already running in standalone mode, redirect to the main app
    if (window.matchMedia('(display-mode: standalone)').matches) {
      router.replace('/welcome');
      return; // Stop further execution
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    setIsReady(true); // Component is ready to be displayed

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [router]);
  
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
        localStorage.setItem('homepalate_installed', 'true');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'HomePalate',
      text: 'Check out HomePalate to discover homemade meals from local cooks!',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.origin);
        toast({
            title: "Link Copied!",
            description: "The installation link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "Could not share",
        description: "There was an error trying to share the app.",
      });
    }
  };

  const handleContinue = () => {
    // Mark as installed/visited so we don't show this page again
    localStorage.setItem('homepalate_installed', 'true');
  }

  // Show a loading state until the client-side check is complete
  if (!isReady) {
      return <Loading />;
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-body">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4">
             <Image src="/icons/icon.svg" width={80} height={80} alt="HomePalate Logo" />
           </div>
          <CardTitle className="font-headline text-2xl">Install HomePalate</CardTitle>
          <p className="text-muted-foreground">For the best experience, add our app to your home screen.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-2">
            {deferredPrompt && (
              <Button onClick={handleInstallClick} className="w-full" size="lg">
                Install App
              </Button>
            )}
             <Button onClick={handleShare} variant="outline" className="w-full" size="lg">
              <Share className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

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
