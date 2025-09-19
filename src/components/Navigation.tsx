import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, MessageCircle, Calendar, BookOpen, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { title: "Chat Support", href: "/chat", icon: MessageCircle },
    { title: "Book Appointment", href: "/booking", icon: Calendar },
    { title: "Resources", href: "/resources", icon: BookOpen },
    { title: "Community", href: "/peer-support", icon: Users },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary shadow-soft">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            MindCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-foreground/70"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
          
          <div className="flex items-center space-x-4 ml-8">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-foreground/70">Hello, {user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <AuthModal>
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </AuthModal>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
            
            <div className="border-t pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70 px-3">Hello, {user.email}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthModal>
                  <Button variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </AuthModal>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;