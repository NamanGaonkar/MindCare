import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Film, Mic, BookOpen, Users } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

const resourceData = {
  featured: [
    { title: 'Campus Counseling Center', description: 'Official university counseling services.', link: '#', icon: BookOpen },
    { title: 'Student Health Services', description: 'Medical and wellness support.', link: '#', icon: Users },
  ],
  articles: [
    { title: 'Understanding Anxiety', description: 'Learn about the symptoms and types of anxiety.', link: '#', icon: BookOpen },
    { title: 'Tips for Better Sleep', description: 'Improve your sleep hygiene for better mental health.', link: '#', icon: BookOpen },
  ],
  videos: [
    { title: 'Guided Meditation for Stress', description: 'A 10-minute guided meditation to calm your mind.', link: '#', icon: Film },
    { title: 'The Science of Happiness', description: 'A TED talk on the science of well-being.', link: '#', icon: Film },
  ],
  podcasts: [
    { title: 'The Happiness Lab', description: 'Dr. Laurie Santos on the science of happiness.', link: '#', icon: Mic },
    { title: 'Feeling Good Podcast', description: 'Cognitive Behavioral Therapy (CBT) techniques.', link: '#', icon: Mic },
  ],
};

const Resources = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = (category) =>
    resourceData[category].filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user) {
        return (
          <>
            <Navigation />
            <div className="container text-center py-20">
              <h1 className="text-2xl font-semibold mb-4">Please Sign In</h1>
              <p className="text-muted-foreground mb-6">You need to be signed in to access the resources.</p>
              <AuthModal><Button>Sign In</Button></AuthModal>
            </div>
            <Footer />
          </>
        );
      }

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Resource Library</h1>
          <p className="mt-3 text-lg text-muted-foreground">Explore curated articles, videos, and tools to support your well-being.</p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="w-full pl-12 py-3 rounded-full bg-muted border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-10">
          <ResourceSection title="Featured Resources" resources={filteredResources('featured')} />
          <ResourceSection title="Articles & Guides" resources={filteredResources('articles')} />
          <ResourceSection title="Videos & Webinars" resources={filteredResources('videos')} />
          <ResourceSection title="Podcasts & Audio" resources={filteredResources('podcasts')} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ResourceSection = ({ title, resources }) => {
  if (resources.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((item, index) => (
          <a href={item.link} key={index} target="_blank" rel="noopener noreferrer" className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Resources;
