
"use client";

import { CartProvider } from '@/context/CartContext';
import AppShell from '@/components/shared/AppShell';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <CartProvider>
            <AppShell>
                {children}
            </AppShell>
        </CartProvider>
    )
}
