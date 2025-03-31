
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Avatar from "@/components/common/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageSquare, UserPlus, Filter, CheckCircle2 } from "lucide-react";
import { Notification } from "@/types";
import { mockNotifications } from "@/data/mockData";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const likeNotifications = notifications.filter(n => n.type === 'like');
  const commentNotifications = notifications.filter(n => n.type === 'comment');
  const followNotifications = notifications.filter(n => n.type === 'follow');

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    ));
  };

  const getActiveNotifications = () => {
    switch (activeTab) {
      case 'unread': return unreadNotifications;
      case 'likes': return likeNotifications;
      case 'comments': return commentNotifications;
      case 'follows': return followNotifications;
      default: return notifications;
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-rose-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'follow': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'mention': return <Bell className="h-4 w-4 text-amber-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationContent = (notification: Notification) => {
    const fromUser = notification.fromUser?.name || 'Someone';
    
    switch (notification.type) {
      case 'like':
        return `${fromUser} liked your post.`;
      case 'comment':
        return `${fromUser} commented on your post: "${notification.content}"`;
      case 'follow':
        return `${fromUser} started following you.`;
      case 'mention':
        return `${fromUser} mentioned you in a post.`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={markAllAsRead}>
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
              <Button variant="outline" size="icon" title="Filter notifications">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full md:w-[500px] mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadNotifications.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="follows">Follows</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <Card>
                {getActiveNotifications().length > 0 ? (
                  <div className="divide-y">
                    {getActiveNotifications().map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 flex items-start gap-3 ${!notification.isRead ? 'bg-accent/50' : ''}`}
                      >
                        <div className="mt-1">
                          {notification.fromUser ? (
                            <Avatar user={notification.fromUser} size="md" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p>{getNotificationContent(notification)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-muted-foreground">You don't have any notifications yet</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
