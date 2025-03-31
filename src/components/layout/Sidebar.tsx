
import { Link, useLocation } from "react-router-dom";
import { Home, Users, TrendingUp, PieChart, MessageSquare, BookOpen, Settings, BarChart2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import { currentUser } from "@/data/mockData";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

function SidebarItem({ icon, label, to, active }: SidebarItemProps) {
  return (
    <Button 
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3",
        active ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
      )}
      asChild
    >
      <Link to={to}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const mainNavItems = [
    { icon: <Home className="h-5 w-5" />, label: "Feed", to: "/" },
    { icon: <Users className="h-5 w-5" />, label: "Friends", to: "/friends" },
    { icon: <UserPlus className="h-5 w-5" />, label: "Groups", to: "/groups" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages", to: "/messages" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Markets", to: "/markets" },
  ];

  const analysisItems = [
    { icon: <BarChart2 className="h-5 w-5" />, label: "Charts", to: "/charts" },
    { icon: <PieChart className="h-5 w-5" />, label: "Portfolio", to: "/portfolio" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Education", to: "/education" },
  ];

  return (
    <div className="w-[240px] border-r h-[calc(100vh-4rem)] hidden md:flex flex-col bg-card p-3 sticky top-16">
      {/* User Profile */}
      <Link to="/profile">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors duration-200">
          <Avatar user={currentUser} size="sm" />
          <div className="flex-1 overflow-hidden">
            <p className="font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
          </div>
        </div>
      </Link>

      <Separator className="my-3" />

      {/* Main Navigation */}
      <div className="space-y-1">
        {mainNavItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={pathname === item.to}
          />
        ))}
      </div>

      <Separator className="my-3" />

      {/* Analysis Section */}
      <p className="px-2 text-xs font-medium text-muted-foreground mb-1">ANALYSIS</p>
      <div className="space-y-1">
        {analysisItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={pathname === item.to}
          />
        ))}
      </div>

      <div className="flex-1"></div>

      <Separator className="my-3" />
      
      {/* Settings */}
      <SidebarItem
        icon={<Settings className="h-5 w-5" />}
        label="Settings"
        to="/settings"
        active={pathname === "/settings"}
      />
    </div>
  );
}
