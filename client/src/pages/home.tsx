import { useState } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FilterBar } from "@/components/ui/filter-bar";
import { InteractiveMap } from "@/components/map/interactive-map";
import { IssueList } from "@/components/issues/issue-list";
import { ReportIssueModal } from "@/components/issues/report-issue-modal";
import { Button } from "@/components/ui/button";
import { mockIssues, mockUsers, getCategoryIcon, getStatusColor, formatTimeAgo } from "@/lib/mock-data";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import type { InsertIssue } from "@shared/schema";

// Random usernames for demo
const usernames = [
  "Courteous Coyote", "Encore ABJ", "Bold Oyster", "Fancy Chamois", 
  "Ambitious Buffalo", "Advanced Mantis", "Bronze Crab", "Actual Gerbil",
  "Celebrated Woodpecker", "Trustworthy Piranha", "Determined Crow"
];

const getRandomUsername = () => usernames[Math.floor(Math.random() * usernames.length)];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all", 
    distance: "5km",
  });
  const { toast } = useToastNotifications();

  const handleIssueClick = (issueId: string) => {
    setLocation(`/issue/${issueId}`);
  };

  const handleReportSubmit = (data: InsertIssue & { images?: string[]; anonymous?: boolean }) => {
    console.log("Report submitted:", data);
    toast().success(
      "Issue reported successfully!",
      "Your report has been submitted and will be reviewed by the city.",
      4000
    );
    // TODO: Submit to backend
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <Header />
      
      <main className="relative">
        <FilterBar onFilterChange={handleFilterChange} />
        
        <InteractiveMap 
          issues={mockIssues}
          onIssueClick={handleIssueClick}
        />
        
        {/* Issue Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockIssues.slice(0, 12).map((issue) => {
              const reporter = mockUsers.find(u => u.id === issue.reporterId);
              return (
                <div
                  key={issue.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleIssueClick(issue.id)}
                >
                  {/* Issue Image */}
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl opacity-60">{getCategoryIcon(issue.category)}</span>
                    
                    {/* User Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 border border-border">
                      <div className="w-6 h-6 bg-civic-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {reporter?.username.charAt(0).toUpperCase() || "A"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {getRandomUsername()}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)} text-white`}>
                      {issue.status.replace('-', ' ')}
                    </div>
                  </div>
                  
                  {/* Issue Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-civic-blue transition-colors">
                      {issue.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {issue.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <span>{getCategoryIcon(issue.category)}</span>
                        <span>{issue.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👍 {issue.upvotes || Math.floor(Math.random() * 20) + 1}</span>
                        <span>💬 {Math.floor(Math.random() * 10) + 1}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(issue.createdAt || new Date())}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled className="w-8 h-8 p-0">
              ←
            </Button>
            {[1, 2, 3, 4, 11].map((page, index) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={`w-8 h-8 p-0 ${page === 1 ? "bg-civic-blue hover:bg-civic-blue/90" : ""}`}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
              →
            </Button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 bg-civic-blue text-white rounded-full shadow-lg hover:bg-civic-blue/90 hover:scale-105 transition-all duration-200 z-50"
        onClick={() => setIsReportModalOpen(true)}
        aria-label="Report new issue"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <ReportIssueModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
