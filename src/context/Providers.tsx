
"use client";

import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import AppShell from '@/components/shared/AppShell';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <CartProvider>
            <OrderProvider>
                <AppShell>
                    {children}
                </AppShell>
            </OrderProvider>
        </CartProvider>
    )
}
