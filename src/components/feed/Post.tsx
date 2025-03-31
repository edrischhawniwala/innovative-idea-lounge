
import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Heart, Share2, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import CommentsList from "./CommentsList";
import { Post as PostType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { getEnrichedComments } from "@/data/mockData";

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  
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

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
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
