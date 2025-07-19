
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TicketPercent, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockVouchers = [
  {
    code: 'TIFFIN10',
    description: '10% off your next tiffin service subscription.',
    vendor: 'Daily Tiffins',
  },
  {
    code: 'WELCOME5',
    description: '$5 off your first order from any home cook.',
    vendor: 'Any Home Cook',
  },
];

export default function PromotionsPage() {
    const { toast } = useToast();

    const handleRedeem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get('promoCode');
        toast({
            title: "Code Applied!",
            description: `Promo code "${code}" has been applied to your account.`
        });
        e.currentTarget.reset();
    }

  return (
    <div className="container py-12 md:py-16">
      <SectionTitle
        title="Promotions & Vouchers"
        subtitle="Your available discounts and special offers."
      />
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-4">
             <h3 className="font-headline text-xl">Available Vouchers</h3>
            {mockVouchers.map((voucher) => (
                <Card key={voucher.code} className="shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Gift className="h-5 w-5 text-primary" /> {voucher.code}
                        </CardTitle>
                        <CardDescription>{voucher.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button className="w-full" size="sm" onClick={() => toast({ title: "Voucher Applied!", description: `Voucher ${voucher.code} is now active.` })}>Apply Voucher</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
         <Card className="h-fit shadow">
            <CardHeader>
                <CardTitle>Redeem a Promo Code</CardTitle>
                <CardDescription>Have a code? Enter it below to add it to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex gap-2" onSubmit={handleRedeem}>
                    <Input name="promoCode" placeholder="Enter your code" />
                    <Button type="submit">Redeem</Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
