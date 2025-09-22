import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import mintBg from "@/assets/mint-theme-background.jpg";
import skyBg from "@/assets/sky-theme-background.jpg";
import orangeBg from "@/assets/orange-theme-background.jpg";
import roseBg from "@/assets/rose-theme-background.jpg";
import darkBg from "@/assets/dark-theme-background.jpg";

const HeroSection = () => {
  const { theme } = useTheme();

  const getBackgroundImage = () => {
    if (theme === 'light') return mintBg;
    if (theme === 'dark') return darkBg;
    return mintBg; // default
  };

  const isLight = theme === 'light';
  const textColor = isLight ? 'text-foreground' : 'text-white';

  return (
    <div
      className="relative bg-cover bg-center py-20"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      {!isLight && <div className="absolute inset-0 bg-black/50"></div>}
      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Your mental wellness matters
        </div>
        <h1 className={`text-5xl md:text-7xl font-bold ${textColor}`}>
          AI-Powered <span className="text-primary">Mental Health</span> Support
        </h1>
        <p className={`mt-6 text-lg md:text-xl max-w-3xl mx-auto ${textColor}`}>
          Get instant, confidential support from our advanced AI assistant trained specifically for student mental health and wellbeing.
        </p>
        <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link to="/chat">
                    Start AI Chat <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={`text-lg px-8 py-4 ${isLight ? 'border-primary text-primary hover:bg-primary/5' : 'text-white border-white hover:bg-white/10'}`}>
                <Link to="/resources">
                    <Book className="mr-2 h-5 w-5" /> Browse Resources
                </Link>
            </Button>
        </div>
      </div>
      <div className="relative container mx-auto px-4 pt-24 pb-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className={`flex flex-col items-center text-center ${textColor}`}>
            <div className="bg-primary/10 rounded-full p-5">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">Confidential</h3>
            <p className="mt-3">Your privacy is our priority.</p>
          </div>
          <div className={`flex flex-col items-center text-center ${textColor}`}>
            <div className="bg-primary/10 rounded-full p-5">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">24/7 Support</h3>
            <p className="mt-3">Available whenever you need us.</p>
          </div>
          <div className={`flex flex-col items-center text-center ${textColor}`}>
            <div className="bg-primary/10 rounded-full p-5">
              <Book className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">AI-Powered Care</h3>
            <p className="mt-3">Advanced AI trained for mental health support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
