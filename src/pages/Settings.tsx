
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Avatar from "@/components/common/Avatar";
import { currentUser } from "@/data/mockData";
import { Camera, Globe, Lock, BellRing, Palette, CreditCard, Users, UserCog, User, LogOut } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  // Various form states
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    username: currentUser.username,
    email: "user@example.com",
    bio: currentUser.bio || "",
    location: "New York, USA",
    website: "fintraders.example.com"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    mentions: true,
    comments: true,
    likes: false,
    newFollowers: true,
    messages: true,
    marketAlerts: true,
    priceAlerts: true,
    newsletterAndUpdates: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    searchable: true,
    showOnlineStatus: true,
    showActivity: true,
    allowTagging: true,
    twoFactorAuth: false
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    if (typeof privacySettings[setting] === 'boolean') {
      setPrivacySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <Card className="md:w-64 p-2">
              <nav className="space-y-1">
                <SettingsNavItem 
                  icon={<User className="h-4 w-4" />}
                  label="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SettingsNavItem 
                  icon={<BellRing className="h-4 w-4" />}
                  label="Notifications"
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                />
                <SettingsNavItem 
                  icon={<Lock className="h-4 w-4" />}
                  label="Privacy & Security"
                  active={activeTab === "privacy"}
                  onClick={() => setActiveTab("privacy")}
                />
                <SettingsNavItem 
                  icon={<Palette className="h-4 w-4" />}
                  label="Appearance"
                  active={activeTab === "appearance"}
                  onClick={() => setActiveTab("appearance")}
                />
                <SettingsNavItem 
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Billing"
                  active={activeTab === "billing"}
                  onClick={() => setActiveTab("billing")}
                />
                <SettingsNavItem 
                  icon={<Users className="h-4 w-4" />}
                  label="Referrals"
                  active={activeTab === "referrals"}
                  onClick={() => setActiveTab("referrals")}
                />
                <Separator className="my-2" />
                <SettingsNavItem 
                  icon={<LogOut className="h-4 w-4" />}
                  label="Logout"
                  onClick={() => console.log("Logout clicked")}
                />
              </nav>
            </Card>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <div className="relative">
                        <Avatar user={currentUser} size="xl" className="h-24 w-24" />
                        <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click to upload a new profile picture
                      </p>
                    </div>
                    
                    <div className="md:w-2/3 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={profileForm.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            name="username" 
                            value={profileForm.username}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={profileForm.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={profileForm.bio}
                          onChange={handleProfileChange}
                          placeholder="Write a short bio..."
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={profileForm.location}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                              <Globe className="h-4 w-4" />
                            </span>
                            <Input 
                              id="website" 
                              name="website" 
                              value={profileForm.website}
                              onChange={handleProfileChange}
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Delivery Methods</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications} 
                          onCheckedChange={() => handleNotificationToggle('emailNotifications')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.pushNotifications} 
                          onCheckedChange={() => handleNotificationToggle('pushNotifications')} 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Activity Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mentions</p>
                          <p className="text-sm text-muted-foreground">When someone mentions you in a post or comment</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.mentions} 
                          onCheckedChange={() => handleNotificationToggle('mentions')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Comments</p>
                          <p className="text-sm text-muted-foreground">When someone comments on your posts</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.comments} 
                          onCheckedChange={() => handleNotificationToggle('comments')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Likes</p>
                          <p className="text-sm text-muted-foreground">When someone likes your posts or comments</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.likes} 
                          onCheckedChange={() => handleNotificationToggle('likes')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Followers</p>
                          <p className="text-sm text-muted-foreground">When someone follows you</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.newFollowers} 
                          onCheckedChange={() => handleNotificationToggle('newFollowers')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">When you receive a new message</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.messages} 
                          onCheckedChange={() => handleNotificationToggle('messages')} 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Market Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Market Alerts</p>
                          <p className="text-sm text-muted-foreground">Major market events and updates</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketAlerts} 
                          onCheckedChange={() => handleNotificationToggle('marketAlerts')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Price Alerts</p>
                          <p className="text-sm text-muted-foreground">When assets hit your designated price targets</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.priceAlerts} 
                          onCheckedChange={() => handleNotificationToggle('priceAlerts')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter & Updates</p>
                          <p className="text-sm text-muted-foreground">Weekly newsletters and platform updates</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.newsletterAndUpdates} 
                          onCheckedChange={() => handleNotificationToggle('newsletterAndUpdates')} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Profile Privacy</h3>
                      <div className="space-y-2">
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select 
                          defaultValue={privacySettings.profileVisibility} 
                          onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                        >
                          <SelectTrigger id="profileVisibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="followers">Followers Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Searchable Profile</p>
                          <p className="text-sm text-muted-foreground">Allow others to find you by name or username</p>
                        </div>
                        <Switch 
                          checked={privacySettings.searchable} 
                          onCheckedChange={() => handlePrivacyToggle('searchable')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Online Status</p>
                          <p className="text-sm text-muted-foreground">Let others see when you're active</p>
                        </div>
                        <Switch 
                          checked={privacySettings.showOnlineStatus} 
                          onCheckedChange={() => handlePrivacyToggle('showOnlineStatus')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Activity</p>
                          <p className="text-sm text-muted-foreground">Show your likes, comments and other activities</p>
                        </div>
                        <Switch 
                          checked={privacySettings.showActivity} 
                          onCheckedChange={() => handlePrivacyToggle('showActivity')} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Tagging</p>
                          <p className="text-sm text-muted-foreground">Allow others to tag you in posts and comments</p>
                        </div>
                        <Switch 
                          checked={privacySettings.allowTagging} 
                          onCheckedChange={() => handlePrivacyToggle('allowTagging')} 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Security</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch 
                          checked={privacySettings.twoFactorAuth} 
                          onCheckedChange={() => handlePrivacyToggle('twoFactorAuth')} 
                        />
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full mt-2">Change Password</Button>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full">Manage Connected Accounts</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Data Management</h3>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full mb-2">Download Your Data</Button>
                      </div>
                      <div>
                        <Button variant="destructive" className="w-full">Delete Account</Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                  <p className="text-muted-foreground mb-6">Customize how FinTraders looks and feels</p>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Theme</h3>
                      <Tabs defaultValue="dark">
                        <TabsList>
                          <TabsTrigger value="light">Light</TabsTrigger>
                          <TabsTrigger value="dark">Dark</TabsTrigger>
                          <TabsTrigger value="system">System</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Accent Color</h3>
                      <div className="flex gap-2">
                        {["#2563eb", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"].map((color) => (
                          <div 
                            key={color} 
                            className={`w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 ring-offset-background ${color === "#2563eb" ? `ring-[${color}]` : "ring-transparent"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Display</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="chartStyle">Chart Style</Label>
                          <Select defaultValue="candlestick">
                            <SelectTrigger id="chartStyle">
                              <SelectValue placeholder="Select chart style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="candlestick">Candlestick</SelectItem>
                              <SelectItem value="ohlc">OHLC</SelectItem>
                              <SelectItem value="line">Line</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Font Size</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger id="fontSize">
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Other tab contents would go here */}
              {(activeTab === "billing" || activeTab === "referrals") && (
                <Card className="p-6 flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                      {activeTab === "billing" ? "Billing Management" : "Referral Program"}
                    </h2>
                    <p className="text-muted-foreground">This feature is coming soon!</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingsNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function SettingsNavItem({ icon, label, active, onClick }: SettingsNavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
