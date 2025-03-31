
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface AvatarProps {
  user: Partial<User>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  className?: string;
}

export default function Avatar({ user, size = "md", onClick, className }: AvatarProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gray-200 overflow-hidden flex-shrink-0",
        sizeClasses[size],
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : "",
        className
      )}
      onClick={onClick}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
          {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
}
