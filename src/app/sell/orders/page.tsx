
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';

export default function SellerOrdersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle
        title="Recent Orders & Reviews"
        subtitle="Manage incoming orders and see what customers are saying."
      />
      <Card className="max-w-4xl mx-auto w-full">
        <CardContent className="pt-6 text-center">
            <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Order and review features are coming soon!</p>
            <p className="text-sm text-muted-foreground mt-1">This section will allow you to accept new orders and respond to reviews.</p>
        </CardContent>
      </Card>
    </div>
  );
}
