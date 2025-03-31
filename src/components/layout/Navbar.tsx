
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Avatar from "@/components/common/Avatar";
import { currentUser, mockNotifications } from "@/data/mockData";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Fin<span className="text-accent">Traders</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!showSearch ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
              </Button>
              <Link to="/profile">
                <Avatar user={currentUser} size="sm" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search users, posts, or topics..." 
                className="min-w-[300px]"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden p-4 bg-card border-t">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            <Link to="/messages" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md" onClick={() => setShowMobileMenu(false)}>
              <MessageCircle className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md" onClick={() => setShowMobileMenu(false)}>
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <span className="h-5 w-5 text-xs flex items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md" onClick={() => setShowMobileMenu(false)}>
              <Avatar user={currentUser} size="xs" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
