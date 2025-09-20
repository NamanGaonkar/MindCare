import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import FeatureCards from "@/components/FeatureCards";
import Testimonials from "@/components/Testimonials";
import { motion } from "framer-motion";

const Home = () => {
  const { theme } = useTheme();

  const getBackgroundImage = () => {
    switch (theme) {
      case 'orange':
        return 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/src/assets/orange-theme-background.jpg)';
      case 'sky':
        return 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/src/assets/sky-theme-background.jpg)'; 
      case 'mint':
        return 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/src/assets/mint-theme-background.jpg)';
      case 'rose':
        return 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/src/assets/rose-theme-background.jpg)';
      case 'dark':
        return 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/src/assets/dark-theme-background.jpg)';
      default:
        return 'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--primary)/0.05))';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section with Theme Background */}
        <section 
          className="relative text-center py-20 md:py-32 lg:py-40 px-4 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: getBackgroundImage(),
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px]"></div>
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Your Mental Wellness Companion
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Uplift is a comprehensive platform for students to find support, connect with counselors, and access resources for a healthier mind.
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/chat">Chat with AI</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="secondary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/booking">Book Appointment</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-6 h-6 bg-white/10 rounded-full"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </section>

        {/* Features Section with Animations */}
        <motion.section 
          id="features" 
          className="py-16 md:py-24 bg-muted/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">A Full Spectrum of Support</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                From immediate AI-driven conversations to professional counseling, we have the right resource for your needs.
              </p>
            </motion.div>
            <FeatureCards />
          </div>
        </motion.section>

        {/* Testimonials Section with Animations */}
        <motion.section 
          id="testimonials" 
          className="py-16 md:py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Hear from Your Peers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                See how Uplift is making a difference in the lives of students just like you.
              </p>
            </motion.div>
            <Testimonials />
          </div>
        </motion.section>

        {/* Call to Action Section with Animations */}
        <motion.section 
          className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <div className="container text-center relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Take the Next Step?
            </motion.h2>
            <motion.p 
              className="text-lg mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join our community and start your journey towards a healthier, happier you. It's easy to get started.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="secondary" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/auth">Sign Up for Free</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
