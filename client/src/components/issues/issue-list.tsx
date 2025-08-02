import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IssueCard } from "./issue-card";
import { Issue, User } from "@shared/schema";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

interface IssueListProps {
  issues: Issue[];
  users: User[];
  onIssueClick: (issueId: string) => void;
  filters: {
    category: string;
    status: string;
    distance: string;
  };
}

export function IssueList({ issues, users, onIssueClick, filters }: IssueListProps) {
  const [displayedIssues, setDisplayedIssues] = useState(12);
  const { toast } = useToastNotifications();

  // Filter issues based on active filters
  const filteredIssues = issues.filter((issue) => {
    if (filters.category !== "all" && issue.category !== filters.category) return false;
    if (filters.status !== "all" && issue.status !== filters.status) return false;
    // Note: Distance filtering would require actual user location in a real app
    return true;
  });

  const handleUpvote = (issueId: string) => {
    toast().success("Vote submitted", "Your vote has been recorded.", 2000);
    console.log("Upvote issue:", issueId);
  };

  const handleFlag = (issueId: string) => {
    toast().warning("Report flagged", "Thank you for reporting. We'll review this issue.", 3000);
    console.log("Flag issue:", issueId);
  };

  const handleLoadMore = () => {
    setDisplayedIssues(prev => Math.min(prev + 12, filteredIssues.length));
  };

  const getUserById = (userId: string | null) => {
    if (!userId) return null;
    return users.find(user => user.id === userId) || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recent Issues</h2>
        <div className="text-sm text-muted-foreground">
          Showing 1-{Math.min(displayedIssues, filteredIssues.length)} of {filteredIssues.length} issues
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.slice(0, displayedIssues).map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            reporter={getUserById(issue.reporterId)}
            onIssueClick={onIssueClick}
            onUpvote={handleUpvote}
            onFlag={handleFlag}
          />
        ))}
      </div>
      
      {displayedIssues < filteredIssues.length && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            className="bg-civic-blue hover:bg-civic-blue/90"
          >
            Load More Issues
          </Button>
        </div>
      )}
    </div>
  );
}
