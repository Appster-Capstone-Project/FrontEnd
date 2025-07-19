
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Vendor } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { MapPin, Utensils, ChefHat, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface TimeAgoProps {
  date: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // This runs only on the client, after hydration, preventing a mismatch
    if (date) {
      setTimeAgo(formatDistanceToNow(new Date(date), { addSuffix: true }));
    }
  }, [date]);

  if (!timeAgo) {
    // Render a placeholder or nothing on the server and initial client render
    return null;
  }

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Clock className="h-3 w-3 mr-1" />
      <span>{timeAgo}</span>
    </div>
  );
};


interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const VendorIcon = vendor.type === 'Home Cook' ? ChefHat : Utensils;
  
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <Link href={`/vendors/${vendor.id}`}>
             <Image
              src={vendor.imageUrl || 'https://placehold.co/400x300.png'}
              alt={vendor.name}
              width={400}
              height={300}
              className="w-full h-48 md:h-full object-cover"
              data-ai-hint={vendor.dataAiHint || 'food vendor'}
            />
          </Link>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <CardContent className="p-6 flex-grow">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                <Badge variant={vendor.type === 'Home Cook' ? 'secondary' : 'outline'} className="capitalize">
                  <VendorIcon className="mr-1 h-4 w-4" />
                  {vendor.type}
                </Badge>
                {vendor.postedAt && <TimeAgo date={vendor.postedAt} />}
               </div>
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
            <Link href={`/vendors/${vendor.id}`} passHref legacyBehavior>
               <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a>
                    View Menu & Reviews <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VendorCard;


    