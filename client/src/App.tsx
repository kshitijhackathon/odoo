import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastNotifications } from "@/components/ui/toast-notifications";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import Home from "@/pages/home";
import IssueDetail from "@/pages/issue-detail";
import AdminDashboard from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/issue/:id" component={IssueDetail} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToastNotifications();
  
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
