
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PostForm from "@/components/feed/PostForm";
import PostsList from "@/components/feed/PostsList";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Use edge function to get posts with user profiles
      const { data, error } = await supabase.functions
        .invoke('get_posts_with_user');
        
      if (error) throw new Error(error.message);
      
      if (data && Array.isArray(data)) {
        // Format posts to match our Post type
        const formattedPosts = data.map((post: any) => ({
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
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          tags: post.tags || []
        }));
        
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Handle post creation success
  const handlePostCreated = () => {
    fetchPosts(); // Refresh posts after creating a new one
  };

  // Handle post deletion
  const handlePostDeleted = () => {
    fetchPosts(); // Refresh posts after deleting one
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-4">
              <PostForm onPostCreated={handlePostCreated} />
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : posts.length > 0 ? (
                <PostsList posts={posts} onPostDeleted={handlePostDeleted} />
              ) : (
                <div className="text-center py-12 bg-card rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground mt-2">Be the first to share something!</p>
                </div>
              )}
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              {/* Trending Topics */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {["#bitcoin", "#forex", "#daytrading", "#stocks", "#investingstrategy"].map((tag) => (
                    <div key={tag} className="group">
                      <a href={`/tag/${tag.substring(1)}`} className="text-sm hover:text-primary transition-colors">
                        {tag}
                      </a>
                      <p className="text-xs text-muted-foreground">324 posts today</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Who to Follow */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Popular Traders</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Martinez", username: "sarahtrading", image: "https://randomuser.me/api/portraits/women/44.jpg" },
                    { name: "Marcus Chen", username: "marcusfx", image: "https://randomuser.me/api/portraits/men/67.jpg" },
                    { name: "Jessica Parker", username: "jparker", image: "https://randomuser.me/api/portraits/women/27.jpg" }
                  ].map((user) => (
                    <div key={user.username} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Button className="text-xs h-8" variant="outline" size="sm">Follow</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
