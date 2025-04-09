
import { useState, useRef } from "react";
import { ImageIcon, BarChart2, PaperclipIcon, SmileIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Avatar from "../common/Avatar";
import { currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PostFormProps {
  onPostCreated?: () => void;
  profileWall?: boolean;
}

export default function PostForm({ onPostCreated, profileWall }: PostFormProps) {
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !mediaPreview) return;
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the post data
      const postData = {
        user_id: user.id,
        content: postText.trim(),
        images: mediaType === "image" && uploadedMediaUrl ? [uploadedMediaUrl] : null,
        videos: mediaType === "video" && uploadedMediaUrl ? [uploadedMediaUrl] : null,
        tags: extractHashtags(postText)
      };
      
      // Create the post using edge function
      const { data: newPost, error } = await supabase.functions
        .invoke('create_post', {
          body: postData
        });
        
      if (error) throw new Error(error.message);
      
      // Reset form
      setPostText("");
      setMediaPreview(null);
      setMediaType(null);
      setUploadedMediaUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      
      // Invalidate cache to refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Notify parent component if callback exists
      if (onPostCreated) {
        onPostCreated();
      }
      
      toast({
        title: "Success",
        description: "Your post has been published.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract hashtags from post content
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    
    if (!matches) return [];
    
    return matches.map(tag => tag.substring(1)); // Remove the # prefix
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
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

    // Create local preview URL
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(type);
    
    // In a real implementation, we would upload the file to storage
    // For now, we'll just use the local URL as a placeholder
    setUploadedMediaUrl(url);
    
    // In a real implementation with Supabase Storage:
    // const { data, error } = await supabase.storage
    //  .from('media')
    //  .upload(`${user.id}/${Date.now()}-${file.name}`, file);
    // if (error) {
    //   toast({ title: "Error", description: "Failed to upload media", variant: "destructive" });
    //   return;
    // }
    // setUploadedMediaUrl(data.path);
  };

  const handleRemoveMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    setUploadedMediaUrl(null);
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
    <Card className={`p-4 mb-4 ${profileWall ? 'mt-6' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Avatar user={user || currentUser} size="md" />
          <div className="flex-1">
            <Textarea
              placeholder={profileWall 
                ? `Share your thoughts on ${user?.name || 'your'} wall...` 
                : "Share your trading insights..."
              }
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
