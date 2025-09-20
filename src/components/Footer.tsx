import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MindCare. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground flex items-center">
          Made with <Heart className="w-4 h-4 mx-1" /> by a student for students.
        </p>
      </div>
    </footer>
  );
};

export default Footer;