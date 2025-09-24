import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Link } from "lucide-react";

const resourcesData = [
  {
    category: "Mental Health Awareness",
    resources: [
      { title: "College Student Mental Health 101", type: "video", url: "https://www.youtube.com/watch?v=2XFzBRSsrWU" },
      { title: "Your Mental Health in College | How to College | Crash Course", type: "video", url: "https://www.youtube.com/watch?v=l_9PchV6PIc" },
      { title: "Mental Health and Resilience - The Secrets of Inner Strength", type: "video", url: "https://www.youtube.com/watch?v=YdMCL9_UTE4" },
      { title: "Mental Health Struggles for Students", type: "video", url: "https://www.youtube.com/watch?v=biuhorYFpYk" },
      { title: "Breaking the Silence - Mental Health @ UCL Engineering", type: "video", url: "https://www.youtube.com/watch?v=lB-u7TH7t4w" },
      { title: "The 5 Lifestyle Habits That Make or Break College Mental Health", type: "video", url: "https://www.youtube.com/watch?v=VR0YejBcZfA" },
      { title: "Mental health tips for new college students", type: "video", url: "https://www.youtube.com/watch?v=kQoylN17_dw" },
    ],
  },
  {
    category: "Stress and Anxiety Management",
    resources: [
      { title: "Student Anxiety & Stress Management", type: "video", url: "https://www.youtube.com/watch?v=U7gE5mHRLcA" },
      { title: "4 Best Stress Management Techniques for Students", type: "video", url: "https://www.youtube.com/watch?v=2vadgxFhiuE" },
      { title: "How to Manage Stress as a Student", type: "video", url: "https://www.youtube.com/watch?v=Bk2-dKH2Ta4" },
      { title: "Stress Relief For Kids - 9 Stress Management Techniques", type: "video", url: "https://www.youtube.com/watch?v=h2zWopNUUJE" },
      { title: "Stress Management Tips for Kids and Teens!", type: "video", url: "https://www.youtube.com/watch?v=3Nf2Pzcketg" },
      { title: "5 Proven Strategies to Boost Your Mental Health Today", type: "video", url: "https://www.youtube.com/watch?v=vGgDIPMyP2g" },
    ],
  },
  {
    category: "Relationship & Social Wellbeing",
    resources: [
      { title: "Best College Dating Advice for Long-Lasting Relationships", type: "video", url: "https://www.youtube.com/watch?v=7dqlaHiXT3Y" },
      { title: "Honest Love Relationship Advice for Students", type: "video", url: "https://www.youtube.com/watch?v=peq6lYlOCjE" },
      { title: "The Best Relationship Advice No One Ever Told You", type: "video", url: "https://www.youtube.com/watch?v=6Kycn43KNOE" },
      { title: "Healthy Relationships and College Students", type: "video", url: "https://www.youtube.com/watch?v=Xv5UaVuXuTw" },
      { title: "Advice on Relationships, College, Work, and Mental Health", type: "video", url: "https://www.youtube.com/watch?v=V3M1-8bpBKY" },
      { title: "The Best Relationship Advice No One Tells You", type: "video", url: "https://www.youtube.com/watch?v=nxQYKNqZB70" },
    ],
  },
  {
    category: "Motivation & Support Channels",
    resources: [
      { title: "Psych Hub - Mental Health Wisdom from Experts", type: "channel", url: "https://www.youtube.com/c/PsychHub" },
      { title: "Kati Morton - Licensed Therapist Mental Health Advice", type: "channel", url: "https://www.youtube.com/user/KatiMorton" },
      { title: "Psych2Go - Animated Mental Health Education", type: "channel", url: "https://www.youtube.com/@Psych2Go" },
      { title: "How to ADHD - Support and Tips for ADHD", type: "channel", url: "https://www.youtube.com/@HowToADHD" },
      { title: "Infinite Waters - Motivational and Mental Health Talks", type: "channel", url: "https://www.youtube.com/@InfiniteWaters" },
      { title: "Therapy in a Nutshell - Scientific Mental Health Resources", type: "channel", url: "https://www.youtube.com/@TherapyInANutshell" },
    ],
  },
];

const VideoModal = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
    <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
      <iframe
        className="w-full aspect-video rounded-lg shadow-2xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
       <Button variant="destructive" size="icon" className="absolute -top-4 -right-4 rounded-full" onClick={onClose}>X</Button>
    </div>
  </div>
);

const Resources = () => {
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openVideo = (url: string) => {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) {
      setSelectedVideo(videoId);
    }
  };

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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Wellness Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A curated collection of videos and channels to support your mental wellbeing.
            </p>
          </div>

          <div className="space-y-12">
            {resourcesData.map((category) => (
              <section key={category.category}>
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource) => (
                    <Card key={resource.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg h-12 leading-tight">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {resource.type === "video" ? (
                          <Button onClick={() => openVideo(resource.url)} className="w-full">
                            <Youtube className="mr-2 h-4 w-4" /> Watch Video
                          </Button>
                        ) : (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full">
                              <Link className="mr-2 h-4 w-4" /> Visit Channel
                            </Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {selectedVideo && <VideoModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default Resources;
