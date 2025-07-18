
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { TicketPercent } from 'lucide-react';

export default function PromotionsPage() {
  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title="Promotions & Vouchers"
        subtitle="Your available discounts and special offers."
        className="text-center"
      />
       <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
            <TicketPercent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No promotions are available for you at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new deals!</p>
        </CardContent>
      </Card>
    </div>
  );
}
