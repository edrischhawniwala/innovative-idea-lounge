
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PostForm from "@/components/feed/PostForm";
import PostsList from "@/components/feed/PostsList";
import { getEnrichedPosts } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

export default function Index() {
  const posts = getEnrichedPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-4">
              <PostForm />
              <PostsList posts={posts} />
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

// Import the Button component directly in the scope for JSX usage
import { Button } from "@/components/ui/button";
