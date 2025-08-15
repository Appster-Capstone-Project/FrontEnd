
"use client";

import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { TicketPercent, Wrench } from 'lucide-react';

export default function PromotionsPage() {
  return (
    <div className="container py-12 md:py-16 flex flex-col items-center justify-center text-center">
      <SectionTitle
        title="Promotions"
        subtitle="Special deals and offers will appear here."
        className="text-center"
      />
       <Card className="w-full max-w-lg mt-8">
            <CardContent className="pt-8">
                <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-headline font-semibold">Feature Coming Soon!</h3>
                <p className="text-muted-foreground mt-2">
                    We are working hard to bring you exciting new promotions. Please check back later!
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
