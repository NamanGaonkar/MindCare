import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  const toggleTheme = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={toggleTheme} />
      <Moon className="h-5 w-5" />
    </div>
  );
}
