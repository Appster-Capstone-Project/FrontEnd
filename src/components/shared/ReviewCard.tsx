import type { Review } from '@/lib/types';
import StarRating from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="mb-4 shadow">
      <CardHeader className="flex flex-row items-center space-x-3 pb-2">
        <Avatar>
          <AvatarImage src={review.userImageUrl} alt={review.userName} data-ai-hint={review.dataAiHintUser || 'person avatar'} />
          <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{review.userName}</p>
          <StarRating rating={review.rating} size={16} />
        </div>
        <p className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
