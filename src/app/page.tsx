
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './loading';

export default function RootPage() {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      router.replace('/welcome');
      return;
    }
    
    // Fallback for browsers or situations where the check is not immediate
    const isInstalled = localStorage.getItem('homepalate_installed') === 'true';
    if (isInstalled) {
      router.replace('/welcome');
    } else {
      router.replace('/install');
    }
  }, [router]);

  return <Loading />;
}
