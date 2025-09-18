import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Clock, 
  Eye,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";

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
    is_urgent: false
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('peer_support_posts')
        .select('*')
        .order('is_urgent', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const { error } = await supabase.from('peer_support_posts').insert({
        user_id: user.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
        is_anonymous: newPost.is_anonymous,
        is_urgent: newPost.is_urgent
      });

      if (error) throw error;

      toast({
        title: "Post Created! 📝",
        description: "Your post has been shared with the community.",
      });

      setNewPost({
        title: "",
        content: "",
        category: "general",
        is_anonymous: true,
        is_urgent: false
      });
      setShowNewPostDialog(false);
      loadPosts();
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "all", name: "All Posts", color: "bg-primary" },
    { id: "general", name: "General", color: "bg-secondary" },
    { id: "academic_stress", name: "Academic Stress", color: "bg-warning" },
    { id: "anxiety", name: "Anxiety", color: "bg-destructive" },
    { id: "depression", name: "Depression", color: "bg-info" },
    { id: "relationships", name: "Relationships", color: "bg-success" },
    { id: "self_care", name: "Self Care", color: "bg-accent" }
  ];

  const filteredPosts = posts.filter(post => 
    selectedCategory === "all" || post.category === selectedCategory
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Peer Support Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with fellow students, share experiences, and support each other in a safe, moderated environment.
            </p>
            
            <Card className="shadow-floating border-border/50 bg-gradient-card max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl">Join Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Sign in to share your experiences and get support from your peers.
                </p>
                <AuthModal>
                  <Button size="lg" className="w-full">
                    Sign In to Join Community
                  </Button>
                </AuthModal>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Peer Support Forum
              </h1>
              <p className="text-muted-foreground">
                A safe space to connect, share, and support each other.
              </p>
            </div>
            
            <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Share with the Community</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="What's on your mind?"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, experiences, or ask for support..."
                      rows={5}
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {categories.filter(c => c.id !== 'all').map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPost.is_anonymous}
                        onChange={(e) => setNewPost(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                      />
                      <span className="text-sm">Post anonymously</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPost.is_urgent}
                        onChange={(e) => setNewPost(prev => ({ ...prev, is_urgent: e.target.checked }))}
                      />
                      <span className="text-sm">Mark as urgent</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={createPost}
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                    >
                      Share Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Posts */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-soft transition-all ease-bounce cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(post.status)}
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === post.category)?.name || post.category}
                          </Badge>
                          {post.is_urgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          {post.is_anonymous && (
                            <Badge variant="secondary" className="text-xs">
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count} views
                        </div>
                      </div>
                      
                      <Badge variant={post.status === 'answered' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No Posts Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to share something with the community!
              </p>
              <Button onClick={() => setShowNewPostDialog(true)}>
                Create First Post
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PeerSupport;