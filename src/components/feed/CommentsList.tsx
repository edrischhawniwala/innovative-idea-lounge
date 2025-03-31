
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment as CommentType } from "@/types";
import { currentUser } from "@/data/mockData";
import Avatar from "../common/Avatar";
import Comment from "./Comment";

interface CommentsListProps {
  postId: string;
  comments: CommentType[];
}

export default function CommentsList({ postId, comments }: CommentsListProps) {
  const [commentText, setCommentText] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // In a real app, we would add the comment to the database
    // For now just reset the form
    setCommentText("");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Comments ({comments.length})</h3>
      
      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar user={currentUser} size="sm" />
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-end">
            <Button size="sm" type="submit" disabled={!commentText.trim()}>
              Post
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 mt-4">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
