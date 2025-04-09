
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Link as LinkIcon, Edit, UserPlus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PostsList from "@/components/feed/PostsList";
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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (!profileId) return;
        
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch posts by this user
        const { data: userPosts, error: postsError } = await supabase
          .rpc('get_posts_with_user', { user_id_param: profileId });
        
        if (postsError) {
          console.error("Error fetching posts:", postsError);
          // Fallback to regular query if RPC is not available
          const { data: fallbackPosts, error: fallbackError } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', profileId)
            .order('created_at', { ascending: false });
            
          if (fallbackError) throw fallbackError;
          
          // Fetch user data for each post
          if (fallbackPosts) {
            const userData = await supabase
              .from('profiles')
              .select('*')
              .eq('id', profileId)
              .single();
              
            if (userData.error) throw userData.error;
            
            const formattedPosts = fallbackPosts.map(post => ({
              id: post.id,
              userId: post.user_id,
              user: {
                id: userData.data.id,
                name: userData.data.username,
                username: userData.data.username,
                avatar: userData.data.avatar,
                role: userData.data.role || 'member',
                joinDate: format(new Date(userData.data.created_at), "yyyy-MM-dd")
              },
              content: post.content,
              images: post.images,
              videos: post.videos,
              createdAt: post.created_at,
              likes: post.likes_count,
              comments: post.comments_count,
              tags: post.tags
            }));
            
            setPosts(formattedPosts);
          }
        } else if (userPosts) {
          // Format posts to match our Post type if RPC was successful
          const formattedPosts = userPosts.map(post => ({
            id: post.id,
            userId: post.user_id,
            user: {
              id: post.profile_id,
              name: post.username,
              username: post.username,
              avatar: post.avatar,
              role: post.role || 'member',
              joinDate: format(new Date(post.created_at), "yyyy-MM-dd")
            },
            content: post.content,
            images: post.images,
            videos: post.videos,
            createdAt: post.created_at,
            likes: post.likes_count,
            comments: post.comments_count,
            tags: post.tags
          }));
          
          setPosts(formattedPosts);
        }
        
        // Get followers count using direct count query
        const { count: followers, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileId);
        
        if (followersError) throw followersError;
        
        // Get following count using direct count query
        const { count: following, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileId);
        
        if (followingError) throw followingError;
        
        // Check if current user is following this profile
        if (currentUser?.id && profileId !== currentUser.id) {
          const { data: followCheck, error: followCheckError } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', profileId)
            .maybeSingle();
          
          if (followCheckError) throw followCheckError;
          setIsFollowing(!!followCheck);
        }
        
        setProfileData(profile);
        setFollowersCount(followers || 0);
        setFollowingCount(following || 0);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [profileId, currentUser?.id]);
  
  const handleFollow = async () => {
    if (!currentUser?.id || !profileId || isOwnProfile) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profileId);
          
        if (error) throw error;
        setFollowersCount(prev => prev - 1);
        toast.success('Unfollowed successfully');
      } else {
        // Follow
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center h-screen">
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

  const joinDate = format(new Date(profileData.created_at), "MMMM yyyy");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
            <div className="container max-w-screen-xl mx-auto px-4">
              <div className="absolute -bottom-16 left-4 lg:left-[calc(50%-18rem)]">
                <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {isOwnProfile && (
                <div className="absolute bottom-4 right-4">
                  <Button variant="secondary" size="sm" className="gap-2" asChild>
                    <Link to="/settings">
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="container max-w-screen-xl mx-auto px-4 pt-20 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold">@{profileData.username}</h1>
                <p className="text-muted-foreground">{profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1).replace('_', ' ')}</p>
              </div>
              {!isOwnProfile && currentUser && (
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    className="gap-2"
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
            
            {/* Bio and Stats */}
            <div className="mt-4">
              <p>{profileData.bio}</p>
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
            
            <Separator className="my-4" />
            
            {/* Tabs */}
            <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
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
              <TabsContent value="posts" className="pt-4">
                {posts.length > 0 ? (
                  <PostsList posts={posts} />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No posts yet</h3>
                    <p className="text-muted-foreground">When you create posts, they'll appear here.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="charts">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No charts yet</h3>
                  <p className="text-muted-foreground">When you share charts, they'll appear here.</p>
                </div>
              </TabsContent>
              <TabsContent value="media">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No media yet</h3>
                  <p className="text-muted-foreground">When you share images or videos, they'll appear here.</p>
                </div>
              </TabsContent>
              <TabsContent value="likes">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No likes yet</h3>
                  <p className="text-muted-foreground">Posts you like will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
