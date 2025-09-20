import { useTheme } from "@/components/ThemeProvider";

const HeroSection = () => {
  const { theme } = useTheme();

  const backgroundImages = {
    light: "/src/assets/hero-mental-health.jpg",
    dark: "/src/assets/hero-mental-health.jpg",
    orange: "/src/assets/orange-theme-background.jpg",
    sky: "/src/assets/sky-theme-background.jpg",
    mint: "/src/assets/mint-theme-background.jpg",
    rose: "/src/assets/rose-theme-background.jpg",
  };

  const backgroundImage = backgroundImages[theme] || backgroundImages.light;

  return (
    <div 
      className="relative bg-cover bg-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-4 py-24 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">Your Mental Wellness Partner</h1>
        <p className="mt-4 text-lg md:text-xl">Find support, connect with counselors, and build resilience.</p>
      </div>
    </div>
  );
};

export default HeroSection;
