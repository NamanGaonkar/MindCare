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
import { Users, MessageSquare, Heart, Clock, Eye, Plus, CheckCircle, AlertCircle, Trash2, Shield } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  is_anonymous: boolean;
  is_urgent: boolean;
  status: 'open' | 'answered' | 'closed';
  view_count: number;
  created_at: string;
  user_id: string;
}

const PeerSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    is_anonymous: true,
  });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('peer_support_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error: any) {
      toast({ title: "Error Loading Posts", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const createPost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const { error } = await supabase.from('peer_support_posts').insert({
        user_id: user.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
        is_anonymous: newPost.is_anonymous,
      });

      if (error) throw error;

      toast({ title: "Post Created! 📝", description: "Your post has been shared with the community." });
      setNewPost({ title: "", content: "", category: "general", is_anonymous: true });
      setShowNewPostDialog(false);
      loadPosts(); // Refresh posts after creation
    } catch (error: any) {
      toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('peer_support_posts').delete().eq('id', postId);
      if (error) throw error;
      
      // Instead of just filtering, we re-fetch to get the true state from the DB
      await loadPosts();

      toast({ title: "Post Deleted!", description: "Your post has been successfully removed." });
    } catch (error: any) {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    }
  };

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "general", name: "General" },
    { id: "academic", name: "Academic Stress" },
    { id: "anxiety", name: "Anxiety" },
    { id: "depression", name: "Depression" },
    { id: "relationships", name: "Relationships" },
  ];

  const filteredPosts = posts.filter(post => 
    selectedCategory === "all" || post.category === selectedCategory
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join the Conversation</h1>
            <p className="text-lg text-muted-foreground mb-8">Sign in to connect with peers and share your experiences.</p>
            <AuthModal><Button size="lg">Sign In to Community</Button></AuthModal>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Peer Support Forum</h1>
              <p className="text-muted-foreground">A safe and anonymous space to connect and share.</p>
            </div>
            <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />New Post</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader><DialogTitle>Share with the Community</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Post Title" value={newPost.title} onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))} />
                  <Textarea placeholder="Share your thoughts anonymously..." rows={6} value={newPost.content} onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                      <Label>Category</Label>
                      <select className="w-full p-2 border rounded-md"><option value="general">General</option></select>
                    </Select>
                    <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" id="anonymousCheck" checked={newPost.is_anonymous} onChange={(e) => setNewPost(prev => ({...prev, is_anonymous: e.target.checked}))} />
                        <Label htmlFor="anonymousCheck">Post Anonymously</Label>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-3 text-sm">
                    <Shield size={24} className="text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">Your post will be anonymous by default. Your user information will not be displayed.</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>Cancel</Button>
                    <Button onClick={createPost} disabled={!newPost.title.trim() || !newPost.content.trim()}>Share Post</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex border-b mb-4">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`py-2 px-4 text-sm font-medium ${selectedCategory === cat.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12"><p>Loading posts...</p></div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.length > 0 ? filteredPosts.map(post => (
                <Card key={post.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                        </div>
                        {post.user_id === user?.id && (
                            <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                        )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                        <span>{post.is_anonymous ? 'Posted Anonymously' : 'Posted by User'}</span>
                        <span>{new Date(post.created_at).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No Posts in this Category</h3>
                  <p className="text-sm text-muted-foreground">Be the first to share something!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PeerSupport;
