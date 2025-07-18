
"use client";

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function CartSheet({ children }: { children: React.ReactNode }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const total = getCartTotal();

  const handleCheckout = () => {
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your delicious meal is on its way!",
    });
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4 pr-4">
              <div className="flex flex-col gap-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.imageUrl || 'https://placehold.co/100x100.png'}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover h-16 w-16"
                      data-ai-hint={item.dataAiHint || 'food dish'}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                          className="h-8 w-16 mr-2"
                        />
                         <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter>
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                    Proceed to Checkout
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-headline text-xl">Your cart is empty</p>
            <p className="text-muted-foreground">Add some delicious food to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
