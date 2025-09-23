import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Heart, Plus, Trash2 } from "lucide-react";

const PeerSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
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
      let query = supabase
        .from('peer_support_posts')
        .select(`
          id,
          created_at,
          title,
          content,
          category,
          is_anonymous,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;
      
      // Fetch reactions and comments separately
      const postIds = postsData?.map(post => post.id) || [];
      
      const { data: reactionsData } = await supabase
        .from('peer_support_reactions')
        .select('post_id, user_id, reaction_type')
        .in('post_id', postIds);
        
      const { data: commentsData } = await supabase
        .from('peer_support_comments')
        .select('post_id')
        .in('post_id', postIds);
        
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', postsData?.map(post => post.user_id) || []);
      
      // Combine the data
      const postsWithCounts = postsData?.map(post => ({
        ...post,
        reactions: reactionsData?.filter(r => r.post_id === post.id) || [],
        comments: [{ count: commentsData?.filter(c => c.post_id === post.id).length || 0 }],
        author: post.is_anonymous ? null : profilesData?.find(p => p.user_id === post.user_id)
      })) || [];
      
      setPosts(postsWithCounts);
    } catch (error) {
      toast({ title: "Error Loading Posts", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

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

      toast({ title: "Post Created!" });
      setNewPost({ title: "", content: "", category: "general", is_anonymous: true });
      setShowNewPostDialog(false);
      loadPosts();
    } catch (error) {
      toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
    }
  };

  const deletePost = async (postId) => {
    try {
      await supabase.from('peer_support_comments').delete().eq('post_id', postId);
      await supabase.from('peer_support_reactions').delete().eq('post_id', postId);
      const { error } = await supabase.from('peer_support_posts').delete().eq('id', postId);
      if (error) throw error;
      loadPosts();
      toast({ title: "Post Deleted!" });
    } catch (error) {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    }
  };

  const toggleReaction = async (postId) => {
    if (!user) return;

    try {
        const { data: existingReaction, error: fetchError } = await supabase
            .from('peer_support_reactions')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (existingReaction) {
            await supabase.from('peer_support_reactions').delete().eq('id', existingReaction.id);
        } else {
            await supabase.from('peer_support_reactions').insert({ post_id: postId, user_id: user.id, reaction_type: 'like' });
        }

        loadPosts(); 

    } catch (error) {
        toast({ title: "Error reacting to post", description: error.message, variant: "destructive" });
    }
  }

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "general", name: "General" },
    { id: "academic", name: "Academic Stress" },
    { id: "anxiety", name: "Anxiety" },
    { id: "depression", name: "Depression" },
    { id: "relationships", name: "Relationships" },
  ];

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
                <DialogHeader>
                  <DialogTitle>Share with the Community</DialogTitle>
                  <DialogDescription>
                    Create a new post to share your thoughts with fellow students anonymously and safely.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Post Title" value={newPost.title} onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))} />
                  <Textarea placeholder="Share your thoughts anonymously..." rows={6} value={newPost.content} onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))} />
                   <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" id="anonymousCheck" checked={newPost.is_anonymous} onChange={(e) => setNewPost(prev => ({...prev, is_anonymous: e.target.checked}))} />
                        <Label htmlFor="anonymousCheck">Post Anonymously</Label>
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
              {posts.length > 0 ? posts.map(post => (
                <Card key={post.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                                <Link to={`/peer-support/${post.id}`}>
                                    <CardTitle className="text-xl hover:text-primary transition-colors">{post.title}</CardTitle>
                                </Link>
                            </div>
                            {post.user_id === user?.id && (
                                <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                           <span>{post.is_anonymous ? 'Posted Anonymously' : `Posted by ${post.author?.full_name || 'User'}`}</span>
                            <div className="flex items-center gap-4">
                               <button onClick={() => toggleReaction(post.id)} className="flex items-center gap-1 text-muted-foreground hover:text-pink-500">
                                    <Heart className={`h-4 w-4 ${post.reactions.some(r => r.user_id === user.id) ? 'fill-current text-pink-500' : ''}`} />
                                    {post.reactions.length}
                                </button>
                                <Link to={`/peer-support/${post.id}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                                    <MessageSquare className="h-4 w-4" /> 
                                    {post.comments[0]?.count || 0}
                                </Link>
                                <span>{new Date(post.created_at).toLocaleString()}</span>
                            </div>
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
