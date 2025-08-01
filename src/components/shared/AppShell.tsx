
"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define paths that should NOT have the main header and footer
  // as they have their own dedicated layouts.
  const noShellRoutes = ['/auth', '/sell', '/loading'];

  const showShell = !noShellRoutes.some(path => pathname.startsWith(path));

  if (showShell) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </div>
    );
  }

  // For routes without the shell, just render the children
  return <>{children}</>;
}
