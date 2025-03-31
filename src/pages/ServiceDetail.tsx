
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Service, ServiceReview } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, Clock, Repeat, Check, AlertCircle } from 'lucide-react';
import ServiceReviews from '@/components/marketplace/ServiceReviews';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

// Mock data
const mockServices: Record<string, Service> = {
  '1': {
    id: '1',
    providerId: '1',
    provider: {
      id: '1',
      name: 'John Trader',
      username: 'johntrader',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'service_provider',
      joinDate: '2023-01-15T10:00:00Z',
      bio: 'Professional trader with 10+ years of experience in crypto and forex markets.',
    },
    title: 'Premium Crypto Signals',
    description: 'Get exclusive daily signals for cryptocurrency trading with detailed entry/exit points and risk management guidance. Our signals have a proven track record of 78% accuracy based on historical performance.',
    category: 'signals',
    type: 'subscription',
    price: 49.99,
    isSubscription: true,
    subscriptionPeriod: 'monthly',
    rating: 4.8,
    reviewCount: 124,
    coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1632&auto=format&fit=crop',
    createdAt: '2023-05-15T10:00:00Z',
    featured: true
  },
};

const mockReviews: ServiceReview[] = [
  {
    id: '1',
    serviceId: '1',
    userId: '2',
    user: {
      id: '2',
      name: 'Alice Williams',
      username: 'alicew',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'member',
      joinDate: '2023-02-10T09:15:00Z',
    },
    rating: 5,
    content: 'Absolutely worth every penny! The signals are accurate and the analysis that comes with them helps me understand the market better.',
    createdAt: '2023-07-15T14:30:00Z',
  },
  {
    id: '2',
    serviceId: '1',
    userId: '3',
    user: {
      id: '3',
      name: 'Robert Johnson',
      username: 'robertj',
      avatar: 'https://i.pravatar.cc/150?img=6',
      role: 'member',
      joinDate: '2023-03-05T11:45:00Z',
    },
    rating: 4,
    content: 'Great service, though I wish there were more signals during volatile market periods. Otherwise, very helpful.',
    createdAt: '2023-08-22T10:15:00Z',
  },
];

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: service } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      // In a real app, we would fetch from an API
      return mockServices[serviceId || '1'];
    },
    enabled: !!serviceId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['service-reviews', serviceId],
    queryFn: async () => {
      // In a real app, we would fetch from an API
      return mockReviews;
    },
    enabled: !!serviceId,
  });

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
            <div className="text-center py-12">
              <p className="text-xl">Service not found</p>
              <Link to="/marketplace">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    if (service.isSubscription) {
      setIsSubscribed(true);
      toast({
        title: 'Subscription Successful',
        description: `You are now subscribed to ${service.title}!`,
      });
    } else {
      toast({
        title: 'Purchase Successful',
        description: `You have purchased ${service.title}!`,
      });
    }
  };

  const formatPrice = (service: Service) => {
    if (service.type === 'hourly') {
      return `$${service.price}/hour`;
    } else if (service.isSubscription) {
      const period = service.subscriptionPeriod === 'monthly' 
        ? 'month' 
        : service.subscriptionPeriod === 'quarterly' 
          ? 'quarter' 
          : 'year';
      return `$${service.price}/${period}`;
    } else {
      return `$${service.price}`;
    }
  };

  const serviceFeatures = [
    'Access to all trading signals',
    'Detailed entry and exit points',
    'Risk management guidance',
    'Daily market updates',
    'Private community access'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
          <Link to="/marketplace" className="flex items-center mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={service.coverImage} 
                  alt={service.title} 
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Badge className="mr-2">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1">{service.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({service.reviewCount} reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
                <p className="text-gray-600">{service.description}</p>
              </div>
              
              <Tabs defaultValue="details" className="w-full mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Service Details</TabsTrigger>
                  <TabsTrigger value="provider">About Provider</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {serviceFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="provider">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={service.provider?.avatar} />
                          <AvatarFallback>{service.provider?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{service.provider?.name}</CardTitle>
                          <p className="text-sm text-gray-500">@{service.provider?.username}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{service.provider?.bio}</p>
                      <p className="text-sm text-gray-500">Member since {new Date(service.provider?.joinDate || '').toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ServiceReviews reviews={reviews} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{formatPrice(service)}</CardTitle>
                  <div className="flex items-center text-sm">
                    {service.type === 'hourly' ? (
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    ) : service.isSubscription ? (
                      <Repeat className="h-4 w-4 mr-1 text-gray-500" />
                    ) : null}
                    <span className="text-gray-500">
                      {service.type === 'hourly' 
                        ? 'Hourly Rate' 
                        : service.isSubscription 
                          ? `Billed ${service.subscriptionPeriod}` 
                          : 'One-time purchase'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isSubscribed ? (
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                      <div className="flex items-center text-green-700 mb-2">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-medium">Subscribed</span>
                      </div>
                      <p className="text-sm text-green-600">You are currently subscribed to this service.</p>
                    </div>
                  ) : (
                    <>
                      <Button 
                        className="w-full text-lg py-6" 
                        onClick={handlePurchase}
                      >
                        {service.isSubscription ? 'Subscribe Now' : 'Purchase Now'}
                      </Button>
                      
                      <div className="text-sm text-gray-500">
                        {service.isSubscription ? (
                          <p>You can cancel your subscription at any time.</p>
                        ) : (
                          <p>One-time purchase, no recurring charges.</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Money-Back Guarantee</h4>
                    <p className="text-sm text-gray-600">Not satisfied? Get a full refund within 7 days of purchase.</p>
                  </div>
                  
                  <div className="flex items-start border rounded-md p-3 bg-gray-50">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Important Notice</p>
                      <p className="text-gray-600">All investments carry risk. Past performance is not indicative of future results.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
