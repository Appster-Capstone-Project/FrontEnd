"use client";

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { CartProvider } from '@/context/CartContext';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
