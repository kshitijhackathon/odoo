import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastNotifications } from "@/components/ui/toast-notifications";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import Home from "@/pages/home";
import IssueDetail from "@/pages/issue-detail";
import AdminDashboard from "@/pages/admin";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import MyReports from "@/pages/my-reports";
import Activity from "@/pages/activity";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/issue/:id" component={IssueDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/my-reports" component={MyReports} />
      <Route path="/activity" component={Activity} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, removeToast } = useToastNotifications();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Show loading screen only on page reload/fresh load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Minimum 3 seconds to showcase the animation

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <>
      <Router />
      <ToastNotifications toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="civic-track-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
