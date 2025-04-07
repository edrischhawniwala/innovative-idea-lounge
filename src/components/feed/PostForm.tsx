
import { useState, useRef } from "react";
import { ImageIcon, BarChart2, PaperclipIcon, SmileIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Avatar from "../common/Avatar";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function PostForm() {
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !mediaPreview) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setPostText("");
      setMediaPreview(null);
      setMediaType(null);
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Your post has been published.",
      });
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(type);
  };

  const handleRemoveMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
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
            
            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative mt-3 border rounded-md overflow-hidden">
                {mediaType === "image" ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full max-h-80 object-contain"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="w-full max-h-80"
                  />
                )}
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={handleRemoveMedia}
                >
                  Remove
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {/* Hidden file inputs */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "image")}
                />
                <input 
                  type="file" 
                  ref={videoInputRef}
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "video")}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-9 w-9"
                  onClick={handleImageClick}
                >
                  <ImageIcon className="h-5 w-5 text-primary" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-9 w-9"
                  onClick={handleVideoClick}
                >
                  <Video className="h-5 w-5 text-primary" />
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
                disabled={(!postText.trim() && !mediaPreview) || isSubmitting}
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
