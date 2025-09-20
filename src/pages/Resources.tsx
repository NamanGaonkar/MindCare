import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Brain, Users, Search } from "lucide-react";

const Resources = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (topic: string) => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' mental health')}`;
    window.open(youtubeSearchUrl, "_blank");
  };

  const categories = [
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Find Your Calm
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore a world of guided meditations, calming exercises, and expert advice on YouTube.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for topics like 'anxiety', 'stress', 'mindfulness'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="w-full pl-12 pr-4 py-3 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
              onClick={() => handleSearch(searchTerm)}
            >
              Search
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-xl hover:-translate-y-2 transition-all ease-in-out duration-300 cursor-pointer overflow-hidden rounded-lg border-2 border-primary/10"
                onClick={() => handleSearch(category.name)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;
