
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Heart, Share2, BarChart2, ChevronDown, ChevronUp, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import CommentsList from "./CommentsList";
import { Post as PostType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { getEnrichedComments } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface PostProps {
  post: PostType;
  onPostDeleted?: () => void;
}

export default function Post({ post, onPostDeleted }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const comments = getEnrichedComments(post.id);
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  // Determine media type
  const hasVideo = post.videos && post.videos.length > 0;
  const hasImage = post.images && post.images.length > 0;

  // Check if the current user is the post owner
  const isOwnPost = user?.id === post.userId;
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (!isOwnPost) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
        
      if (error) throw error;
      
      toast.success("Post deleted successfully");
      
      // Refresh posts list if callback provided
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <Avatar user={post.user!} size="md" />
          </Link>
          <div className="flex-1">
            <Link to={`/profile/${post.userId}`} className="font-medium hover:underline">
              {post.user?.name}
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>@{post.user?.username}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Post actions menu - only show for user's own posts */}
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        <div className="mt-3">
          <p className="whitespace-pre-line">{post.content}</p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag} 
                  to={`/tag/${tag}`}
                  className="text-xs text-primary hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Post Video */}
        {hasVideo && (
          <div className="mt-3 rounded-md overflow-hidden border">
            <video
              src={post.videos[0]}
              className="w-full"
              controls
              preload="metadata"
            />
          </div>
        )}

        {/* Post Images (only if no video) */}
        {!hasVideo && hasImage && (
          <div className="mt-3 rounded-md overflow-hidden border">
            <img 
              src={post.images[0]} 
              alt="Post attachment" 
              className="w-full object-cover"
              loading="lazy" 
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Post Actions */}
      <div className="p-2 flex">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={handleLike}
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} 
          />
          <span>{likesCount}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2"
          onClick={toggleComments}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2">
          <BarChart2 className="h-4 w-4" />
          <span>Chart</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <Separator />
          <div className="p-4">
            <CommentsList postId={post.id} comments={comments} />
          </div>
        </>
      )}
    </Card>
  );
}
