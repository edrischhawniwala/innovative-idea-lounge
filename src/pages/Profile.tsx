import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Edit, UserPlus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PostsList from "@/components/feed/PostsList";
import PostForm from "@/components/feed/PostForm";
import { format } from "date-fns";
import { User, Post } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Avatar from "@/components/common/Avatar";

type Profile = {
  id: string;
  username: string;
  avatar: string;
  bio: string | null;
  role: string;
  created_at: string;
};

type PostWithProfile = {
  id: string;
  user_id: string;
  content: string;
  images: string[] | null;
  videos: string[] | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  tags: string[] | null;
  profile_id: string;
  username: string;
  avatar: string;
  role: string;
};

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const profileId = userId || currentUser?.id;
  const isOwnProfile = currentUser?.id === profileId;

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      if (!profileId) return;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (profileError) throw profileError;
      
      try {
        const { data: userPosts, error: postsError } = await supabase.functions
          .invoke('get_posts_with_user', {
            body: { user_id_param: profileId }
          });
          
        if (postsError) throw postsError;
        
        if (userPosts && Array.isArray(userPosts)) {
          const formattedPosts = userPosts.map((post: PostWithProfile) => ({
            id: post.id,
            userId: post.user_id,
            user: {
              id: post.profile_id,
              name: post.username,
              username: post.username,
              avatar: post.avatar,
              role: post.role as "member" | "service_user" | "service_provider" | "admin",
              joinDate: format(new Date(post.created_at), "yyyy-MM-dd")
            },
            content: post.content,
            images: post.images || [],
            videos: post.videos || [],
            createdAt: post.created_at,
            likes: post.likes_count,
            comments: post.comments_count,
            tags: post.tags || []
          }));
          
          setPosts(formattedPosts);
        }
      } catch (edgeFunctionError) {
        console.error("Error fetching posts:", edgeFunctionError);
        toast.error("Failed to load posts");
      }
      
      try {
        const { count: followers, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileId);
          
        if (followersError) throw followersError;
        
        setFollowersCount(followers || 0);
      } catch (followersError) {
        console.error('Error fetching followers count:', followersError);
      }
      
      try {
        const { count: following, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileId);
          
        if (followingError) throw followingError;
        
        setFollowingCount(following || 0);
      } catch (followingError) {
        console.error('Error fetching following count:', followingError);
      }
      
      if (currentUser?.id && profileId !== currentUser.id) {
        try {
          const { data: followCheck, error: followCheckError } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', currentUser.id)
            .eq('following_id', profileId);
          
          if (followCheckError) throw followCheckError;
          
          setIsFollowing((followCheck?.length || 0) > 0);
        } catch (followCheckError) {
          console.error('Error checking follow status:', followCheckError);
        }
      }
      
      setProfileData(profile);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileId, currentUser?.id]);
  
  const handleFollow = async () => {
    if (!currentUser?.id || !profileId || isOwnProfile) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profileId);
          
        if (error) throw error;
        
        setFollowersCount(prev => prev - 1);
        toast.success('Unfollowed successfully');
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: profileId
          });
          
        if (error) throw error;
        
        setFollowersCount(prev => prev + 1);
        toast.success('Following successfully');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchProfileData();
  };

  const handlePostDeleted = () => {
    fetchProfileData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold">User not found</h2>
              <p className="text-muted-foreground mt-2">The profile you're looking for doesn't exist.</p>
              <Button variant="default" className="mt-4" asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = profileData ? format(new Date(profileData.created_at), "MMMM yyyy") : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pb-16">
          <div className="h-48 md:h-64 bg-gradient-to-r from-primary/80 to-accent relative">
            <div className="container max-w-screen-xl mx-auto px-4 h-full flex items-end">
              <div className="absolute -bottom-16 md:-bottom-20 left-4 md:left-8 lg:left-[calc(50%-24rem)] z-10">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background overflow-hidden bg-background">
                  <Avatar 
                    user={{
                      avatar: profileData.avatar,
                      name: profileData.username
                    }}
                    size="xl"
                    className="w-full h-full"
                  />
                </div>
              </div>
              {isOwnProfile && (
                <div className="absolute bottom-4 right-4">
                  <Button variant="secondary" size="sm" className="gap-2 shadow-md" asChild>
                    <Link to="/settings">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="container max-w-screen-xl mx-auto px-4 pt-20 md:pt-24 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">@{profileData.username}</h1>
                <p className="text-muted-foreground">{profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1).replace('_', ' ')}</p>
              </div>
              {!isOwnProfile && currentUser && (
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    className="gap-2 shadow-sm"
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              {profileData.bio && (
                <p className="text-foreground/90 whitespace-pre-line">{profileData.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Link to="#" className="text-sm hover:underline">
                  <span className="font-bold">{followingCount}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </Link>
                <Link to="#" className="text-sm hover:underline">
                  <span className="font-bold">{followersCount}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </Link>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="posts" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="charts" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Charts
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="likes" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Likes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="pt-6">
                {isOwnProfile && (
                  <PostForm onPostCreated={handlePostCreated} profileWall={true} />
                )}
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : posts.length > 0 ? (
                  <PostsList posts={posts} onPostDeleted={handlePostDeleted} />
                ) : (
                  <div className="text-center py-12 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-muted-foreground mt-2">When {isOwnProfile ? 'you create' : 'this user creates'} posts, they'll appear here.</p>
                    {isOwnProfile && !posts.length && (
                      <Button variant="default" className="mt-4">
                        Create your first post
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="charts">
                <div className="text-center py-12 mt-6 bg-card rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium">No charts yet</h3>
                  <p className="text-muted-foreground mt-2">When {isOwnProfile ? 'you share' : 'this user shares'} charts, they'll appear here.</p>
                </div>
              </TabsContent>
              <TabsContent value="media">
                <div className="text-center py-12 mt-6 bg-card rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium">No media yet</h3>
                  <p className="text-muted-foreground mt-2">When {isOwnProfile ? 'you share' : 'this user shares'} images or videos, they'll appear here.</p>
                </div>
              </TabsContent>
              <TabsContent value="likes">
                <div className="text-center py-12 mt-6 bg-card rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium">No likes yet</h3>
                  <p className="text-muted-foreground mt-2">Posts {isOwnProfile ? 'you like' : 'this user likes'} will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
