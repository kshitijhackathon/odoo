import { Link, useLocation } from "wouter";
import { Building, Bell, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-civic-blue rounded-lg flex items-center justify-center">
                <Building className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-foreground">CivicTrack</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                location === "/" ? "text-civic-blue" : "text-muted-foreground hover:text-civic-blue"
              }`}
            >
              Map
            </Link>
            <a href="#" className="text-muted-foreground hover:text-civic-blue transition-colors font-medium">
              My Reports
            </a>
            <a href="#" className="text-muted-foreground hover:text-civic-blue transition-colors font-medium">
              Activity
            </a>
            <Link 
              href="/admin"
              className={`font-medium transition-colors flex items-center space-x-1 ${
                location === "/admin" ? "text-civic-blue" : "text-muted-foreground hover:text-civic-blue"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="text-gray-600 dark:text-gray-300 text-sm" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                Sarah Chen
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
