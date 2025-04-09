
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/common/Avatar";
import { LogOut, Settings, User as UserIcon, Shield } from "lucide-react";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar 
          user={{ 
            id: user.id,
            name: user.user_metadata?.name || "User", 
            username: user.email?.split('@')[0] || "user",
            avatar: user.user_metadata?.avatar_url || "" 
          }} 
          size="sm" 
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.user_metadata?.name || user.email?.split('@')[0] || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          navigate('/profile');
          setOpen(false);
        }} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigate('/roles');
          setOpen(false);
        }} className="cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          <span>Role Management</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigate('/settings');
          setOpen(false);
        }} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
