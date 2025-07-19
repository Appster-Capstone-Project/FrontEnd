
import Image from 'next/image';
import Link from 'next/link';
import type { Vendor } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { MapPin, Utensils, ChefHat, ArrowRight } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const VendorIcon = vendor.type === 'Home Cook' ? ChefHat : Utensils;
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
           <Image
            src={vendor.imageUrl || 'https://placehold.co/400x300.png'}
            alt={vendor.name}
            width={400}
            height={300}
            className="w-full h-48 md:h-full object-cover"
            data-ai-hint={vendor.dataAiHint || 'food vendor'}
          />
        </div>
        <div className="md:w-2/3 flex flex-col">
          <CardContent className="p-6 flex-grow">
            <div className="flex items-center justify-between mb-2">
              <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize">
                <VendorIcon className="mr-1 h-4 w-4" />
                {vendor.type}
              </Badge>
              <StarRating rating={vendor.rating} size={18} showText />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2 group">
              <Link href={`/vendors/${vendor.id}`} className="hover:text-primary transition-colors">
                {vendor.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{vendor.description}</p>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              {vendor.specialty && 
                <p className="text-accent font-medium flex items-center">
                  <Utensils className="h-4 w-4 mr-2" />
                  <span>Specialty: {vendor.specialty}</span>
                </p>
              }
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{vendor.city}</span>
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
             <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/vendors/${vendor.id}`}>
                View Menu & Reviews <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VendorCard;
