import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Service, ServiceCategory, ServiceFilter, ServiceType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';
import ServiceCard from '@/components/marketplace/ServiceCard';
import FeaturedServices from '@/components/marketplace/FeaturedServices';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

// Mock data for demonstration purposes
const mockServices: Service[] = [
  {
    id: '1',
    providerId: '1',
    provider: {
      id: '1',
      name: 'John Trader',
      username: 'johntrader',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'service_provider',
      joinDate: '2023-01-15T10:00:00Z',
    },
    title: 'Premium Crypto Signals',
    description: 'Get exclusive daily signals for cryptocurrency trading with detailed entry/exit points and risk management guidance.',
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
  {
    id: '2',
    providerId: '2',
    provider: {
      id: '2',
      name: 'Sarah Finance',
      username: 'sarahfinance',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'service_provider',
      joinDate: '2023-02-22T14:30:00Z',
    },
    title: 'Stock Market Fundamentals Course',
    description: 'Comprehensive course covering stock market basics, chart reading, and fundamental analysis for beginners.',
    category: 'education',
    type: 'one-time',
    price: 199.99,
    isSubscription: false,
    rating: 4.9,
    reviewCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop',
    createdAt: '2023-06-10T09:15:00Z',
  },
  {
    id: '3',
    providerId: '3',
    provider: {
      id: '3',
      name: 'Mike Analyst',
      username: 'mikeanalyst',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'service_provider',
      joinDate: '2023-03-10T11:45:00Z',
    },
    title: 'Custom Market Analysis',
    description: 'Personalized analysis of specific stocks or cryptocurrencies with detailed reports and recommendations.',
    category: 'analysis',
    type: 'hourly',
    price: 75.00,
    isSubscription: false,
    rating: 4.6,
    reviewCount: 37,
    coverImage: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1470&auto=format&fit=crop',
    createdAt: '2023-07-22T16:30:00Z',
  },
  {
    id: '4',
    providerId: '4',
    provider: {
      id: '4',
      name: 'Emma Mentor',
      username: 'emmamentor',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'service_provider',
      joinDate: '2023-04-05T13:20:00Z',
    },
    title: 'Trading Mentorship Program',
    description: 'One-on-one mentorship sessions to develop your trading strategy and improve your market performance.',
    category: 'mentoring',
    type: 'subscription',
    price: 299.99,
    isSubscription: true,
    subscriptionPeriod: 'monthly',
    rating: 4.9,
    reviewCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1470&auto=format&fit=crop',
    createdAt: '2023-08-18T10:45:00Z',
    featured: true
  },
  {
    id: '5',
    providerId: '5',
    provider: {
      id: '5',
      name: 'Alex Developer',
      username: 'alexdev',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'service_provider',
      joinDate: '2023-05-20T09:10:00Z',
    },
    title: 'Trading Bot Development',
    description: 'Custom trading bot development for automating your trading strategies across multiple exchanges.',
    category: 'freelance',
    type: 'one-time',
    price: 599.99,
    isSubscription: false,
    rating: 4.7,
    reviewCount: 18,
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1470&auto=format&fit=crop',
    createdAt: '2023-09-05T14:20:00Z',
  },
];

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ServiceFilter>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
  });

  const { data: services = mockServices, isLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      // In a real app, we'd fetch from an API
      return mockServices;
    }
  });

  const featuredServices = services.filter(service => service.featured);

  const handleFilterChange = (key: keyof ServiceFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterServices = (service: Service) => {
    // Filter by search term
    if (searchTerm && !service.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.category && service.category !== filters.category) {
      return false;
    }
    
    // Filter by type
    if (filters.type && service.type !== filters.type) {
      return false;
    }
    
    // Filter by price
    if (filters.minPrice !== undefined && service.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice !== undefined && service.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by rating
    if (filters.minRating !== undefined && service.rating < filters.minRating) {
      return false;
    }
    
    return true;
  };

  const filteredServices = services.filter(filterServices);
  
  const categoryOptions: { value: ServiceCategory; label: string }[] = [
    { value: 'signals', label: 'Trading Signals' },
    { value: 'analysis', label: 'Market Analysis' },
    { value: 'education', label: 'Educational Courses' },
    { value: 'mentoring', label: 'Mentoring' },
    { value: 'freelance', label: 'Freelance Services' },
    { value: 'other', label: 'Other Services' },
  ];
  
  const typeOptions: { value: ServiceType; label: string }[] = [
    { value: 'one-time', label: 'One-time Purchase' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'hourly', label: 'Hourly Rate' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
          <div className="container mx-auto py-6 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Marketplace</h1>
              <Button asChild>
                <Link to="/marketplace/list-service">List Your Service</Link>
              </Button>
            </div>
            
            {featuredServices.length > 0 && (
              <div className="mb-8">
                <FeaturedServices services={featuredServices} />
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 border rounded-md">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Service Type</label>
                    <Select 
                      value={filters.type} 
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {typeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price Range</label>
                    <div className="pt-4 px-2">
                      <Slider
                        defaultValue={[filters.minPrice || 0, filters.maxPrice || 1000]}
                        max={1000}
                        step={10}
                        onValueChange={(values) => {
                          handleFilterChange('minPrice', values[0]);
                          handleFilterChange('maxPrice', values[1]);
                        }}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>${filters.minPrice}</span>
                        <span>${filters.maxPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Minimum Rating</label>
                    <Select 
                      value={String(filters.minRating)} 
                      onValueChange={(value) => handleFilterChange('minRating', Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="signals">Signals</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
                <TabsTrigger value="freelance">Freelance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <p>Loading services...</p>
                  ) : filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                      <ServiceCard key={service.id} service={service} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-lg text-gray-500">No services match your filters</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({
                            minPrice: 0,
                            maxPrice: 1000,
                            minRating: 0,
                          });
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {categoryOptions.map(category => (
                <TabsContent key={category.value} value={category.value}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices
                      .filter(service => service.category === category.value)
                      .map(service => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
