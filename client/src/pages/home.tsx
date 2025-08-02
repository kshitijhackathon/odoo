import { useState } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { FilterBar } from "@/components/ui/filter-bar";
import { InteractiveMap } from "@/components/map/interactive-map";
import { IssueList } from "@/components/issues/issue-list";
import { ReportIssueModal } from "@/components/issues/report-issue-modal";
import { Button } from "@/components/ui/button";
import { mockIssues, mockUsers } from "@/lib/mock-data";
import type { InsertIssue } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all", 
    distance: "5km",
  });

  const handleIssueClick = (issueId: string) => {
    setLocation(`/issue/${issueId}`);
  };

  const handleReportSubmit = (data: InsertIssue & { images?: string[]; anonymous?: boolean }) => {
    console.log("Report submitted:", data);
    // TODO: Submit to backend
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="relative">
        <FilterBar onFilterChange={handleFilterChange} />
        
        <InteractiveMap 
          issues={mockIssues}
          onIssueClick={handleIssueClick}
        />
        
        <IssueList
          issues={mockIssues}
          users={mockUsers}
          onIssueClick={handleIssueClick}
          filters={filters}
        />
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
