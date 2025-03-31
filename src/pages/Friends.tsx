
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Avatar from "@/components/common/Avatar";
import { Search, UserCheck, UserPlus, UsersRound } from "lucide-react";
import { useState } from "react";

// Mock data for friends list
const mockFriends = [
  { id: "1", name: "Sarah Martinez", username: "sarahtrading", avatar: "https://randomuser.me/api/portraits/women/44.jpg", mutualFriends: 8 },
  { id: "2", name: "Marcus Chen", username: "marcusfx", avatar: "https://randomuser.me/api/portraits/men/67.jpg", mutualFriends: 3 },
  { id: "3", name: "Jessica Parker", username: "jparker", avatar: "https://randomuser.me/api/portraits/women/27.jpg", mutualFriends: 5 },
  { id: "4", name: "David Wilson", username: "dwilson", avatar: "https://randomuser.me/api/portraits/men/32.jpg", mutualFriends: 2 },
  { id: "5", name: "Emily Johnson", username: "emilytrades", avatar: "https://randomuser.me/api/portraits/women/33.jpg", mutualFriends: 7 },
];

// Mock data for friend suggestions
const mockSuggestions = [
  { id: "6", name: "Robert Brown", username: "robforex", avatar: "https://randomuser.me/api/portraits/men/22.jpg", mutualFriends: 4 },
  { id: "7", name: "Sophia Lee", username: "sophialee", avatar: "https://randomuser.me/api/portraits/women/54.jpg", mutualFriends: 2 },
  { id: "8", name: "Michael Taylor", username: "miketaylor", avatar: "https://randomuser.me/api/portraits/men/42.jpg", mutualFriends: 6 },
];

// Mock data for friend requests
const mockRequests = [
  { id: "9", name: "Olivia Smith", username: "olivias", avatar: "https://randomuser.me/api/portraits/women/12.jpg", mutualFriends: 1 },
  { id: "10", name: "James Johnson", username: "jamesjfx", avatar: "https://randomuser.me/api/portraits/men/52.jpg", mutualFriends: 3 },
];

export default function Friends() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFriends = mockFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Friends</h1>
              <p className="text-muted-foreground">Connect with other traders</p>
            </div>
            <div className="mt-4 md:mt-0 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                className="pl-10 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                <span>All Friends</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Requests</span>
                {mockRequests.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {mockRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span>Suggestions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium">No friends found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockRequests.map((request) => (
                  <FriendRequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="suggestions">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSuggestions.map((suggestion) => (
                  <FriendSuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function FriendCard({ friend }: { friend: typeof mockFriends[0] }) {
  return (
    <Card className="p-4 flex">
      <Avatar user={{ name: friend.name, avatar: friend.avatar }} size="lg" />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{friend.name}</h3>
        <p className="text-sm text-muted-foreground">@{friend.username}</p>
        <p className="text-xs text-muted-foreground mt-1">{friend.mutualFriends} mutual friends</p>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline">Message</Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">Unfriend</Button>
        </div>
      </div>
    </Card>
  );
}

function FriendRequestCard({ request }: { request: typeof mockRequests[0] }) {
  return (
    <Card className="p-4 flex">
      <Avatar user={{ name: request.name, avatar: request.avatar }} size="lg" />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{request.name}</h3>
        <p className="text-sm text-muted-foreground">@{request.username}</p>
        <p className="text-xs text-muted-foreground mt-1">{request.mutualFriends} mutual friends</p>
        <div className="flex gap-2 mt-3">
          <Button size="sm">Accept</Button>
          <Button size="sm" variant="outline">Decline</Button>
        </div>
      </div>
    </Card>
  );
}

function FriendSuggestionCard({ suggestion }: { suggestion: typeof mockSuggestions[0] }) {
  return (
    <Card className="p-4 flex">
      <Avatar user={{ name: suggestion.name, avatar: suggestion.avatar }} size="lg" />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{suggestion.name}</h3>
        <p className="text-sm text-muted-foreground">@{suggestion.username}</p>
        <p className="text-xs text-muted-foreground mt-1">{suggestion.mutualFriends} mutual friends</p>
        <div className="flex gap-2 mt-3">
          <Button size="sm">Add Friend</Button>
          <Button size="sm" variant="ghost">Remove</Button>
        </div>
      </div>
    </Card>
  );
}
