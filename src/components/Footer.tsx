import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MindfulMate</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students with comprehensive mental health support and resources for a healthier, happier life.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/resources" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="/booking" className="hover:text-primary transition-colors">Book Counseling</a></li>
              <li><a href="/peer-support" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="/chat" className="hover:text-primary transition-colors">AI Chat</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Campus Hotline: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Crisis Support: 1075</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@mindfulmate.in</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Available nationwide</span>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 MindfulMate. All rights reserved.</p>
          <p className="mt-2">Design by <span className="font-semibold text-primary">Team Nexus</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;