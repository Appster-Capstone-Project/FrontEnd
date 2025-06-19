import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showText?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16, className, showText = false }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="hsl(var(--primary))" strokeWidth={0} size={size} className="text-primary" />
      ))}
      {halfStar && <StarHalf key="half" fill="hsl(var(--primary))" strokeWidth={0} size={size} className="text-primary" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} fill="hsl(var(--muted))" strokeWidth={0} size={size} className="text-muted-foreground opacity-50" />
      ))}
      {showText && <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>}
    </div>
  );
};

export default StarRating;
