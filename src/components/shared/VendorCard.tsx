
import Image from 'next/image';
import Link from 'next/link';
import type { Vendor } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { MapPin, Utensils, ChefHat } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const VendorIcon = vendor.type === 'Home Cook' ? ChefHat : Utensils;
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={vendor.imageUrl || 'https://placehold.co/400x250.png'}
          alt={vendor.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          data-ai-hint={vendor.dataAiHint || 'food vendor'}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize">
            <VendorIcon className="mr-1 h-4 w-4" />
            {vendor.type}
          </Badge>
          <StarRating rating={vendor.rating || 0} size={18} />
        </div>
        <CardTitle className="font-headline text-xl mb-1 group">
          <Link href={`/vendors/${vendor.id}`} className="hover:text-primary transition-colors">
            {vendor.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{vendor.description}</p>
        {vendor.specialty && <p className="text-xs text-accent mb-2">Specialty: {vendor.specialty}</p>}
         <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{vendor.address}, {vendor.city}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/vendors/${vendor.id}`}>View Menu & Reviews</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VendorCard;
