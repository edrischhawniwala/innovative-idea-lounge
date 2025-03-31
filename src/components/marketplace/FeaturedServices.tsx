
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface FeaturedServicesProps {
  services: Service[];
}

const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Featured Services</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {services.map(service => (
            <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden h-full">
                <div 
                  className="h-48 relative bg-cover bg-center" 
                  style={{ backgroundImage: `url(${service.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <Badge className="self-start mb-2 bg-yellow-500">Featured</Badge>
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm text-white">{service.rating}</span>
                      </div>
                      <span className="text-xs text-gray-300 ml-1">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-bold">
                      {service.isSubscription ? `$${service.price}/${service.subscriptionPeriod?.slice(0, 2) || 'mo'}` : `$${service.price}`}
                    </div>
                    <Button size="sm" as={Link} to={`/marketplace/${service.id}`}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default FeaturedServices;
