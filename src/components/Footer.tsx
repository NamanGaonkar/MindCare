import { Link } from "react-router-dom";

const Footer = () => {
  const navLinks = [
    { title: "About Us", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Resources", href: "/resources" },
    { title: "Contact", href: "/contact" },
    { title: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    <path d="M8.5 10.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 15c-1.66 0-3 1.34-3 3h6c0-1.66-1.34-3-3-3z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">MindCare</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your confidential space for mental wellness and support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Made by Naman Gaonkar & team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
