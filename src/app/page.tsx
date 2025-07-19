
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './loading';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const isInstalled = localStorage.getItem('homepalate_installed') === 'true';
    if (isInstalled) {
      router.replace('/welcome');
    } else {
      router.replace('/install');
    }
  }, [router]);

  return <Loading />;
}
