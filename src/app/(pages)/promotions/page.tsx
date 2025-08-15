
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TicketPercent } from 'lucide-react';


export default function PromotionsPage() {
  return (
    <div className="container py-12 md:py-16">
       <SectionTitle 
        title="Today's Special Promotions"
        subtitle="Exclusive discounts on freshly added meals from our best cooks."
        className="mb-8"
      />
      <Card className="py-24 text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
              <TicketPercent className="h-10 w-10" />
          </div>
          <CardTitle className="font-headline text-2xl">Coming Soon!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            We are working hard to bring you exciting offers. Please check back later!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
