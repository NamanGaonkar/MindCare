import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground text-center md:text-left">
            <p className="font-bold text-foreground">MindCare</p>
            <p>A mental wellness platform for students.</p>
        </div>
        <p className="text-sm text-muted-foreground flex items-center">
          Designed by Naman Gaonkar & Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;