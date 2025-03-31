
import React from 'react';
import { ServiceReview } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ServiceReviewsProps {
  reviews: ServiceReview[];
}

const ServiceReviews: React.FC<ServiceReviewsProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-center my-6 text-gray-500">No reviews yet.</p>;
  }

  // Function to generate star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={review.user?.avatar} />
                <AvatarFallback>{review.user?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.user?.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>{renderStars(review.rating)}</div>
          </div>
          <p className="text-gray-700">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceReviews;
