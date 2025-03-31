
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Repeat } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const formatPrice = (price: number, type: ServiceType, isSubscription: boolean) => {
    if (type === 'hourly') {
      return `$${price}/hour`;
    } else if (isSubscription) {
      return `$${price}/${service.subscriptionPeriod?.slice(0, 2) || 'mo'}`;
    } else {
      return `$${price}`;
    }
  };

  const getBadgeColor = (category: ServiceCategory) => {
    switch (category) {
      case 'signals':
        return 'bg-blue-100 text-blue-800';
      case 'analysis':
        return 'bg-purple-100 text-purple-800';
      case 'education':
        return 'bg-green-100 text-green-800';
      case 'mentoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'freelance':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 overflow-hidden">
        <img 
          src={service.coverImage} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getBadgeColor(service.category)}>
              {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
            </Badge>
            <h3 className="text-xl font-semibold mt-2">{service.title}</h3>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{service.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({service.reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
        
        <div className="flex items-center mt-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={service.provider?.avatar} />
            <AvatarFallback>{service.provider?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">{service.provider?.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center">
          {service.type === 'hourly' ? (
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
          ) : service.isSubscription ? (
            <Repeat className="h-4 w-4 mr-1 text-gray-500" />
          ) : null}
          <span className="font-bold">
            {formatPrice(service.price, service.type, service.isSubscription)}
          </span>
        </div>
        <Button as={Link} to={`/marketplace/${service.id}`} size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
