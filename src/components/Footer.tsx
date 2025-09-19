import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t mt-16">
      <div className="container px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">MindfulMate</span>
          </div>
          
          {/* Credits */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Supporting student mental wellness through technology
            </p>
            <p className="text-xs text-muted-foreground">
              Design by <span className="font-semibold text-primary">Team Nexus</span>
            </p>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MindfulMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;