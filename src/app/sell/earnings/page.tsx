
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function SellerEarningsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <SectionTitle
        title="Your Earnings"
        subtitle="Track your sales and payouts here."
      />
       <Card className="max-w-4xl mx-auto w-full">
        <CardContent className="pt-6 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">The earnings dashboard is coming soon!</p>
            <p className="text-sm text-muted-foreground mt-1">You will be able to track your revenue and manage payouts from this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
