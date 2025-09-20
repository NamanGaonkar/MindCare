import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import FeatureCards from "@/components/FeatureCards";
import Testimonials from "@/components/Testimonials";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 lg:py-40 px-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Your Mental Wellness Companion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Uplift is a comprehensive platform for students to find support, connect with counselors, and access resources for a healthier mind.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/chat">Chat with AI</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/booking">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-muted/40">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">A Full Spectrum of Support</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                From immediate AI-driven conversations to professional counseling, we have the right resource for your needs.
              </p>
            </div>
            <FeatureCards />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Hear from Your Peers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                See how Uplift is making a difference in the lives of students just like you.
              </p>
            </div>
            <Testimonials />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our community and start your journey towards a healthier, happier you. It is easy to get started.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link to="/auth">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
