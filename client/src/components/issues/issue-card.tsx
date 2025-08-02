import { ArrowUp, MessageCircle, Flag, CheckCircle, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Issue, User } from "@shared/schema";
import { getCategoryIcon, getStatusColor, formatTimeAgo } from "@/lib/mock-data";

interface IssueCardProps {
  issue: Issue;
  reporter?: User | null;
  onIssueClick: (issueId: string) => void;
  onUpvote: (issueId: string) => void;
  onFlag: (issueId: string) => void;
}

export function IssueCard({ issue, reporter, onIssueClick, onUpvote, onFlag }: IssueCardProps) {
  const statusColor = getStatusColor(issue.status);
  const categoryIcon = getCategoryIcon(issue.category);
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative h-48" onClick={() => onIssueClick(issue.id)}>
        <img 
          src={issue.images[0] || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
          alt={issue.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${statusColor} text-white`}>
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
            {getStatusLabel(issue.status)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-2xl">{categoryIcon}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 cursor-pointer"
            onClick={() => onIssueClick(issue.id)}
          >
            {issue.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500 ml-2 h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onFlag(issue.id);
            }}
            aria-label="Flag as spam"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {issue.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {issue.isAnonymous ? (
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <UserCheck className="text-white h-3 w-3" />
                </div>
              ) : (
                <div className="w-5 h-5 bg-civic-emerald rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white h-3 w-3" />
                </div>
              )}
              <span className="text-xs font-medium text-gray-700">
                {issue.isAnonymous ? "Anonymous" : reporter?.username || "Unknown"}
              </span>
            </div>
            <span className="text-gray-400">·</span>
            <span className="text-xs text-gray-500">
              {/* Mock distance calculation */}
              {Math.floor(Math.random() * 5) + 0.1} km away
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-civic-blue p-0"
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(issue.id);
              }}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{issue.upvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-civic-blue p-0"
              onClick={() => onIssueClick(issue.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {/* Mock comment count */}
                {Math.floor(Math.random() * 10) + 1}
              </span>
            </Button>
          </div>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(issue.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
