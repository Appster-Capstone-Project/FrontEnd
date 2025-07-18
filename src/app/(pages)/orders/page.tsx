
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title="My Orders"
        subtitle="Track your past and current orders here."
        className="text-center"
      />
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
            <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">You have no orders yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Start browsing to find your next delicious meal!</p>
        </CardContent>
      </Card>
    </div>
  );
}
