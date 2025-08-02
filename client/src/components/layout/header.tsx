import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building, Bell, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";

export function Header() {
  const [location] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock unread count - in real app this would come from state/API
  const unreadNotifications = 2;

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-civic-blue rounded-lg flex items-center justify-center">
                <Building className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-foreground">CivicTrack</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 bg-civic-emerald rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">D</span>
              </div>
              <span className="font-medium text-foreground">Determined Crow</span>
            </div>
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
            <Link 
              href="/my-reports"
              className={`font-medium transition-colors ${
                location === "/my-reports" ? "text-civic-blue" : "text-muted-foreground hover:text-civic-blue"
              }`}
            >
              My Reports
            </Link>
            <Link 
              href="/activity"
              className={`font-medium transition-colors ${
                location === "/activity" ? "text-civic-blue" : "text-muted-foreground hover:text-civic-blue"
              }`}
            >
              Activity
            </Link>
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
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <NotificationDropdown 
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button 
                  size="sm" 
                  className="bg-civic-blue hover:bg-civic-blue/90 text-white rounded-full px-6"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
