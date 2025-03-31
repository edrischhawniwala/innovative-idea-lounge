
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Search, Plus, Send, MoreVertical, Phone, Video } from "lucide-react";

// Mock conversations data
const mockConversations = [
  { 
    id: "1", 
    user: { id: "u1", name: "Sarah Martinez", username: "sarahtrading", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    lastMessage: { text: "What do you think about the recent Bitcoin price movement?", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    unread: 2
  },
  { 
    id: "2", 
    user: { id: "u2", name: "Marcus Chen", username: "marcusfx", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    lastMessage: { text: "I've shared my latest chart analysis with you", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    unread: 0
  },
  { 
    id: "3", 
    user: { id: "u3", name: "Jessica Parker", username: "jparker", avatar: "https://randomuser.me/api/portraits/women/27.jpg" },
    lastMessage: { text: "Thanks for the trading tip!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    unread: 0
  },
  { 
    id: "4", 
    user: { id: "u4", name: "David Wilson", username: "dwilson", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    lastMessage: { text: "Let's discuss the forex market trends tomorrow", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    unread: 0
  },
];

// Mock messages for the current conversation
const mockMessages = [
  { id: "m1", senderId: "u1", text: "Hey, have you seen the recent market movement?", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "m2", senderId: "current", text: "Yes, it's quite volatile today", timestamp: new Date(Date.now() - 1000 * 60 * 55) },
  { id: "m3", senderId: "u1", text: "What do you think is causing it?", timestamp: new Date(Date.now() - 1000 * 60 * 50) },
  { id: "m4", senderId: "current", text: "Probably the fed announcement", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: "m5", senderId: "u1", text: "That makes sense. Are you planning to make any trades based on this movement?", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "m6", senderId: "current", text: "I'm waiting for the market to stabilize a bit more before making any decisions. What about you?", timestamp: new Date(Date.now() - 1000 * 60 * 25) },
  { id: "m7", senderId: "u1", text: "I'm considering shorting if it breaks the support level, but will wait for confirmation", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
  { id: "m8", senderId: "u1", text: "What do you think about the recent Bitcoin price movement?", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
];

export default function Messages() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredConversations = mockConversations.filter((conv) => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    conv.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real app, you'd send the message to your backend
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="container max-w-screen-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
              {/* Conversations List */}
              <Card className="lg:col-span-4 flex flex-col overflow-hidden">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" title="New message">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors duration-200 ${
                          activeConversation.id === conversation.id ? 'bg-accent/50' : ''
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <Avatar user={conversation.user} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{conversation.user.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: false })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.text}</p>
                            {conversation.unread > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No conversations found
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Current Conversation */}
              <Card className="lg:col-span-8 flex flex-col overflow-hidden">
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-b flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar user={activeConversation.user} size="sm" />
                        <div>
                          <h3 className="font-medium">{activeConversation.user.name}</h3>
                          <p className="text-xs text-muted-foreground">@{activeConversation.user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {mockMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.senderId === 'current' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === 'current' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Type a message..." 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No conversation selected</h3>
                      <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
