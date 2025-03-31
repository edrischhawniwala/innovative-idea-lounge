
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Group, GroupMember, GroupPost, StreamSession, User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Lock, Globe, Crown, ArrowLeft, Video, Mic, 
  ScreenShare, Calendar, Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data
const mockGroups: Record<string, Group> = {
  '1': {
    id: '1',
    name: 'Trading Strategies',
    description: 'Discuss and share trading strategies for stocks and crypto.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop',
    memberCount: 152,
    type: 'member',
    privacy: 'public',
    createdAt: '2023-05-15T10:00:00Z'
  },
  '2': {
    id: '2',
    name: 'Crypto Signals',
    description: 'Premium signals for cryptocurrency trading with daily updates and market analysis.',
    coverImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1470&auto=format&fit=crop',
    memberCount: 67,
    type: 'provider',
    privacy: 'private',
    isSubscription: true,
    price: 29.99,
    createdAt: '2023-06-20T14:30:00Z'
  }
};

const mockMembers: GroupMember[] = [
  { 
    id: '1', 
    groupId: '1', 
    userId: '1',
    user: { 
      id: '1', 
      name: 'John Doe', 
      username: 'johndoe', 
      avatar: 'https://i.pravatar.cc/150?img=1', 
      role: 'member', 
      joinDate: '2023-01-15T10:00:00Z'
    },
    role: 'admin',
    joinedAt: '2023-05-15T10:00:00Z' 
  },
  { 
    id: '2', 
    groupId: '1', 
    userId: '2',
    user: { 
      id: '2', 
      name: 'Jane Smith', 
      username: 'janesmith', 
      avatar: 'https://i.pravatar.cc/150?img=2', 
      role: 'member', 
      joinDate: '2023-02-20T15:30:00Z'
    },
    role: 'moderator',
    joinedAt: '2023-05-16T11:30:00Z' 
  },
];

const mockPosts: GroupPost[] = [
  {
    id: '101',
    groupId: '1',
    userId: '1',
    user: { 
      id: '1', 
      name: 'John Doe', 
      username: 'johndoe', 
      avatar: 'https://i.pravatar.cc/150?img=1', 
      role: 'member', 
      joinDate: '2023-01-15T10:00:00Z'
    },
    content: 'Just shared my latest analysis on Bitcoin trends in the files section!',
    createdAt: '2023-08-10T14:25:00Z',
    likes: 15,
    comments: 3,
  },
];

const mockStreams: StreamSession[] = [
  {
    id: '1',
    groupId: '1',
    hostId: '1',
    host: { 
      id: '1', 
      name: 'John Doe', 
      username: 'johndoe', 
      avatar: 'https://i.pravatar.cc/150?img=1', 
      role: 'member', 
      joinDate: '2023-01-15T10:00:00Z'
    },
    title: 'Weekly Market Analysis',
    type: 'video',
    status: 'scheduled',
    scheduledFor: '2023-09-15T18:00:00Z',
    participantCount: 0
  },
  {
    id: '2',
    groupId: '2',
    hostId: '2',
    host: { 
      id: '2', 
      name: 'Jane Smith', 
      username: 'janesmith', 
      avatar: 'https://i.pravatar.cc/150?img=2', 
      role: 'member', 
      joinDate: '2023-02-20T15:30:00Z'
    },
    title: 'Live Trading Session',
    type: 'screen',
    status: 'live',
    startedAt: '2023-09-10T15:30:00Z',
    participantCount: 24
  }
];

const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      // In a real app, fetch group from API
      return mockGroups[groupId || '1'];
    },
    enabled: !!groupId
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      // In a real app, fetch members from API
      return mockMembers;
    },
    enabled: !!groupId
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['group-posts', groupId],
    queryFn: async () => {
      // In a real app, fetch posts from API
      return mockPosts;
    },
    enabled: !!groupId
  });

  const { data: streams = [] } = useQuery({
    queryKey: ['group-streams', groupId],
    queryFn: async () => {
      // In a real app, fetch streams from API
      return mockStreams.filter(stream => stream.groupId === groupId);
    },
    enabled: !!groupId
  });

  if (!group) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="text-center">
          <p>Group not found</p>
          <Link to="/groups">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleJoinGroup = () => {
    if (group.isSubscription) {
      toast({
        title: "Subscription Required",
        description: `This is a premium group that costs $${group.price}/month.`,
      });
    } else {
      setIsJoined(true);
      toast({
        title: "Success",
        description: "You have joined the group!",
      });
    }
  };

  const handleLeaveGroup = () => {
    setIsJoined(false);
    toast({
      title: "Left Group",
      description: "You have left the group successfully.",
    });
  };

  const handleStartStream = (type: 'video' | 'audio' | 'screen') => {
    toast({
      title: "Stream Starting",
      description: `Your ${type} stream is being prepared...`,
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <Link to="/groups" className="flex items-center mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
      </Link>
      
      <div className="relative rounded-lg overflow-hidden mb-6">
        <div className="h-48 md:h-64">
          <img 
            src={group.coverImage} 
            alt={group.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h1>
                {group.privacy === 'private' ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Private
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 text-white">
                    <Globe className="h-3 w-3" /> Public
                  </Badge>
                )}
                {group.type === 'provider' && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500">
                    <Crown className="h-3 w-3" /> Provider
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> 
                  {group.memberCount} members
                </div>
                {group.isSubscription && (
                  <div className="font-medium text-green-400">${group.price}/month</div>
                )}
              </div>
            </div>
            
            <div>
              {isJoined ? (
                <Button variant="destructive" onClick={handleLeaveGroup}>Leave Group</Button>
              ) : (
                <Button onClick={handleJoinGroup}>
                  {group.isSubscription ? 'Subscribe' : 'Join Group'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-600">{group.description}</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Communication</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Start Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Video Stream</DialogTitle>
                <DialogDescription>
                  Start a live video stream for all group members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button onClick={() => handleStartStream('video')}>Start Stream</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Mic className="h-4 w-4" /> Start Audio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Audio Stream</DialogTitle>
                <DialogDescription>
                  Start an audio-only stream for all group members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button onClick={() => handleStartStream('audio')}>Start Stream</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ScreenShare className="h-4 w-4" /> Share Screen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Screen Sharing</DialogTitle>
                <DialogDescription>
                  Share your screen with all group members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button onClick={() => handleStartStream('screen')}>Start Sharing</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          {isJoined && <TabsTrigger value="files">Files</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="feed">
          <Card>
            <CardHeader>
              <CardTitle>Group Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} className="border-b pb-4 mb-4 last:border-0">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={post.user?.avatar} />
                        <AvatarFallback>{post.user?.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.user?.name}</div>
                        <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                        <p className="mt-2">{post.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 my-8">No posts in this group yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user?.avatar} />
                        <AvatarFallback>{member.user?.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user?.name}</div>
                        <div className="text-sm text-gray-500">@{member.user?.username}</div>
                      </div>
                    </div>
                    <Badge>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="streams">
          <Card>
            <CardHeader>
              <CardTitle>Live & Upcoming Streams</CardTitle>
            </CardHeader>
            <CardContent>
              {streams.length > 0 ? (
                <div className="grid gap-4">
                  {streams.map(stream => (
                    <div key={stream.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{stream.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Host: {stream.host?.name}</span>
                            {stream.type === 'video' && <Video className="h-3 w-3" />}
                            {stream.type === 'audio' && <Mic className="h-3 w-3" />}
                            {stream.type === 'screen' && <ScreenShare className="h-3 w-3" />}
                          </div>
                        </div>
                        <Badge 
                          className={`${stream.status === 'live' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                        >
                          {stream.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        {stream.status === 'scheduled' ? (
                          <>
                            <Calendar className="h-3 w-3" />
                            {new Date(stream.scheduledFor || '').toLocaleString()}
                          </>
                        ) : stream.status === 'live' ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {stream.participantCount} watching
                            </span>
                            <Button size="sm">Join Stream</Button>
                          </div>
                        ) : (
                          <span>Ended {new Date(stream.endedAt || '').toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 my-8">No streams available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Files</CardTitle>
              <Button variant="outline" size="sm">Upload File</Button>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 my-8">No files have been shared in this group yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
