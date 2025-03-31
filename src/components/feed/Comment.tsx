
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "../common/Avatar";
import { Comment as CommentType } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  const [isLiked, setIsLiked] = useState(comment.hasLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div className="flex gap-2">
      <Link to={`/profile/${comment.userId}`}>
        <Avatar user={comment.user!} size="sm" />
      </Link>
      <div className="flex-1">
        <div className="bg-secondary p-2 rounded-md">
          <div className="flex items-center">
            <Link to={`/profile/${comment.userId}`} className="font-medium text-sm hover:underline">
              {comment.user?.name}
            </Link>
            <span className="text-xs text-muted-foreground ml-1">@{comment.user?.username}</span>
            <span className="text-xs text-muted-foreground ml-1">•</span>
            <span className="text-xs text-muted-foreground ml-1">{formattedDate}</span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 ml-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={handleLike}
          >
            <Heart
              className={`h-3 w-3 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {likesCount > 0 && <span>{likesCount}</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
          >
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
