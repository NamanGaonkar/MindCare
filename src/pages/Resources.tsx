import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Download,
  Search,
  Star,
  Clock,
  Users,
  Brain
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  content_type: 'video' | 'audio' | 'article' | 'worksheet' | 'guide';
  category: string;
  language: string;
  duration_minutes?: number;
  rating: number;
  view_count: number;
  is_featured: boolean;
  tags: string[];
  url: string;
}

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('mental_health_resources')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('view_count', { ascending: false });

      if (error) throw error;
      setResources((data || []) as Resource[]);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            return urlObj.searchParams.get('v');
        } else if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
    } catch (error) {
        console.error("Invalid URL:", error);
    }
    return null;
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.content_type === 'video' && (resource.url.includes('youtube.com') || resource.url.includes('youtu.be'))) {
        const videoId = getYouTubeVideoId(resource.url);
        if (videoId) {
            setSelectedVideoId(videoId);
            setShowVideoDialog(true);
        } else {
            window.open(resource.url, "_blank");
        }
    } else {
        window.open(resource.url, "_blank");
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Headphones className="h-5 w-5" />;
      case 'article': return <FileText className="h-5 w-5" />;
      case 'worksheet': return <Download className="h-5 w-5" />;
      case 'guide': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "anxiety", name: "Anxiety", icon: Brain },
    { id: "depression", name: "Depression", icon: Brain },
    { id: "stress", name: "Stress Management", icon: Brain },
    { id: "academic", name: "Academic Support", icon: BookOpen },
    { id: "relationships", name: "Relationships", icon: Users },
    { id: "self_care", name: "Self Care", icon: Brain },
    { id: "crisis", name: "Crisis Resources", icon: Brain }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mental Health Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Access our comprehensive library of mental wellness resources, guides, and educational content.
            </p>
            
            <Card className="shadow-floating border-border/50 bg-gradient-card max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Sign In Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Please sign in to access our mental health resource library.
                </p>
                <AuthModal>
                  <Button size="lg" className="w-full">
                    Sign In to Access Resources
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mental Health Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of mental wellness resources, educational content, and self-help tools.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col gap-1 p-3 text-xs"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Resources Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="group hover:shadow-floating transition-all ease-bounce cursor-pointer flex flex-col"
                  onClick={() => handleResourceClick(resource)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getContentIcon(resource.content_type)}
                        <Badge variant={resource.is_featured ? "default" : "secondary"}>
                          {resource.content_type}
                        </Badge>
                        {resource.is_featured && (
                          <Badge variant="default" className="bg-warning text-warning-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {resource.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {resource.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration_minutes}min
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {resource.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {resource.view_count}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No Resources Found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Video Resource</DialogTitle>
          </DialogHeader>
          {selectedVideoId && (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resources;