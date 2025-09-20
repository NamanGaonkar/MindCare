import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Plus, Trash2, Shield, Send, CornerUpLeft } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const PeerSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('peer_support_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({ title: "Error Loading Posts", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (!user) {
    return (
        <>
          <Navigation />
          <div className="container text-center py-20">
            <h1 className="text-2xl font-semibold mb-4">Join the Conversation</h1>
            <p className="text-muted-foreground mb-6">Sign in to connect with peers and share your experiences.</p>
            <AuthModal><Button>Sign In to Community</Button></AuthModal>
          </div>
          <Footer />
        </>
    );
  }

  return (
    <div className="bg-background text-foreground">
        <Navigation />
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Community</h2>
                        <Button size="sm" onClick={() => setShowNewPostDialog(true)}><Plus className="h-4 w-4 mr-1"/>New Post</Button>
                    </div>
                    <PostList posts={posts} onSelectPost={setSelectedPost} selectedPost={selectedPost} />
                </div>
                <div className="md:col-span-2">
                    {selectedPost ? (
                        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-muted/30 rounded-lg p-8 text-center">
                            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">Select a post</h3>
                            <p className="text-muted-foreground">Choose a post from the list to read the conversation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <NewPostDialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog} onPostCreated={loadPosts} />
        <Footer />
    </div>
  );
};

const PostList = ({ posts, onSelectPost, selectedPost }) => (
    <div className="space-y-3">
        {posts.map(post => (
            <Card key={post.id} className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedPost?.id === post.id ? 'bg-muted/50 border-primary' : 'border-border/50'}`} onClick={() => onSelectPost(post)}>
                <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <Badge variant="outline">{post.category}</Badge>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const PostDetail = ({ post, onBack }) => (
    <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden"><CornerUpLeft className="h-4 w-4 mr-1"/>Back</Button>
            <CardTitle>{post.title}</CardTitle>
            <Badge variant="secondary">{post.category}</Badge>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap mb-6">{post.content}</p>
            <div className="text-xs text-muted-foreground pt-4 border-t">
                Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                {post.is_anonymous && <span> anonymously</span>}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-4">Comments</h4>
              {/* Comments would be listed here */}
              <div className="text-center text-muted-foreground py-6">No comments yet.</div>
            </div>
            <div className="mt-6 flex gap-2">
              <Textarea placeholder="Add a supportive comment..."/>
              <Button><Send className="h-4 w-4"/></Button>
            </div>
        </CardContent>
    </Card>
);

const NewPostDialog = ({ open, onOpenChange, onPostCreated }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "general", is_anonymous: true });

    const createPost = async () => {
        if (!user || !newPost.title.trim() || !newPost.content.trim()) return;
        try {
            const { error } = await supabase.from('peer_support_posts').insert({ ...newPost, user_id: user.id });
            if (error) throw error;
            toast({ title: "Post Created!", description: "Your post is now live for the community." });
            setNewPost({ title: "", content: "", category: "general", is_anonymous: true });
            onPostCreated();
            onOpenChange(false);
        } catch (error) {
            toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Create a New Post</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <Input placeholder="Title" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                    <Textarea placeholder="Share your thoughts..." rows={5} value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="anonymousCheck" checked={newPost.is_anonymous} onChange={(e) => setNewPost(prev => ({...prev, is_anonymous: e.target.checked}))} />
                        <Label htmlFor="anonymousCheck">Post Anonymously</Label>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-3 text-sm">
                        <Shield size={24} className="text-primary flex-shrink-0" />
                        <p className="text-muted-foreground">Your post will be anonymous by default. Your user information will not be displayed.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={createPost}>Share</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PeerSupport;
