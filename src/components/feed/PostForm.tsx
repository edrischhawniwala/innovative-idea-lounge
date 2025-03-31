
import { useState } from "react";
import { ImageIcon, BarChart2, PaperclipIcon, SmileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Avatar from "../common/Avatar";
import { currentUser } from "@/data/mockData";

export default function PostForm() {
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setPostText("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar user={currentUser} size="md" />
          <div className="flex-1">
            <Textarea
              placeholder="Share your trading insights..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[80px] border-0 focus-visible:ring-0 resize-none p-0 shadow-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <PaperclipIcon className="h-5 w-5 text-primary" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <SmileIcon className="h-5 w-5 text-primary" />
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={!postText.trim() || isSubmitting}
                className="px-4"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
