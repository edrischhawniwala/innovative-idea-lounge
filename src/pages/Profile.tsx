
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Link as LinkIcon, Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PostsList from "@/components/feed/PostsList";
import { currentUser, getEnrichedPosts } from "@/data/mockData";
import { format } from "date-fns";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const posts = getEnrichedPosts().filter(post => post.userId === currentUser.id);
  const joinDate = format(new Date(currentUser.joinDate), "MMMM yyyy");

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
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="container max-w-screen-xl mx-auto px-4 pt-20 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                <p className="text-muted-foreground">@{currentUser.username}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Follow</span>
                </Button>
              </div>
            </div>
            
            {/* Bio and Stats */}
            <div className="mt-4">
              <p>{currentUser.bio}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>New York, USA</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href="#" className="text-primary">fintraders.example.com</a>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Link to="#" className="text-sm hover:underline">
                  <span className="font-bold">{currentUser.following}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </Link>
                <Link to="#" className="text-sm hover:underline">
                  <span className="font-bold">{currentUser.followers}</span>
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
