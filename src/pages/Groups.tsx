
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Group } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Lock, Globe, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Trading Strategies',
    description: 'Discuss and share trading strategies for stocks and crypto.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop',
    memberCount: 152,
    type: 'member',
    privacy: 'public',
    createdAt: '2023-05-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Crypto Signals',
    description: 'Premium signals for cryptocurrency trading.',
    coverImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1470&auto=format&fit=crop',
    memberCount: 67,
    type: 'provider',
    privacy: 'private',
    isSubscription: true,
    price: 29.99,
    createdAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Beginners Circle',
    description: 'A safe space for beginners to learn about investing.',
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1470&auto=format&fit=crop',
    memberCount: 412,
    type: 'member',
    privacy: 'public',
    createdAt: '2023-04-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Expert Options Analysis',
    description: 'Professional options analysis and strategies.',
    coverImage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1470&auto=format&fit=crop',
    memberCount: 89,
    type: 'provider',
    privacy: 'private',
    isSubscription: true,
    price: 49.99,
    createdAt: '2023-07-05T11:45:00Z'
  }
];

const Groups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const { data: groups = mockGroups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      // In a real app, fetch groups from API
      return mockGroups;
    }
  });

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const memberGroups = filteredGroups.filter(group => group.type === 'member');
  const providerGroups = filteredGroups.filter(group => group.type === 'provider');
  
  const handleCreateGroup = () => {
    toast({
      title: "Coming Soon",
      description: "Group creation will be available soon!",
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Button onClick={handleCreateGroup}>Create Group</Button>
      </div>
      
      <div className="mb-6">
        <Input 
          placeholder="Search groups..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="member">User Groups</TabsTrigger>
          <TabsTrigger value="provider">Provider Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <p>Loading groups...</p>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <p>No groups found matching your search.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="member">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberGroups.length > 0 ? (
              memberGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <p>No user groups found matching your search.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="provider">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerGroups.length > 0 ? (
              providerGroups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <p>No provider groups found matching your search.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img 
          src={group.coverImage} 
          alt={group.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          <div className="flex items-center gap-1">
            {group.privacy === 'private' ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            {group.type === 'provider' && <Crown className="h-4 w-4 text-yellow-500 ml-1" />}
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Users className="h-4 w-4" /> 
          {group.memberCount} members
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm text-gray-600">{group.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Link to={`/groups/${group.id}`}>
          <Button variant="outline" size="sm">View Group</Button>
        </Link>
        {group.isSubscription && (
          <div className="text-sm font-medium text-green-600">${group.price}/month</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Groups;
