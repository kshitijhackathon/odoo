import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Bell, Share2, MapPin, Clock, User, ArrowUp } from "lucide-react";
import { Header } from "@/components/layout/header";
import { IssueTimeline } from "@/components/issues/issue-timeline";
import { CommentsSection } from "@/components/issues/comments-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockIssues, mockUsers, mockComments, mockStatusHistory, getCategoryIcon, getStatusColor, formatTimeAgo } from "@/lib/mock-data";

export default function IssueDetail() {
  const [, params] = useRoute("/issue/:id");
  const [isFollowing, setIsFollowing] = useState(false);
  
  const issueId = params?.id;
  const issue = mockIssues.find(i => i.id === issueId);
  const reporter = issue?.reporterId ? mockUsers.find(u => u.id === issue.reporterId) : null;
  const comments = mockComments.filter(c => c.issueId === issueId);
  const statusHistory = mockStatusHistory.filter(s => s.issueId === issueId);

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(issue.status);
  const categoryIcon = getCategoryIcon(issue.category);
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: Submit follow/unfollow to backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleUpvote = () => {
    // TODO: Submit upvote to backend
    console.log("Upvote issue:", issue.id);
  };

  const handlePostComment = (content: string, parentId?: string) => {
    // TODO: Submit comment to backend
    console.log("Post comment:", { content, parentId, issueId: issue.id });
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Submit comment like to backend
    console.log("Like comment:", commentId);
  };

  const handleFlagComment = (commentId: string) => {
    // TODO: Submit comment flag to backend
    console.log("Flag comment:", commentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </Link>
        </div>

        {/* Issue header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{categoryIcon}</span>
                <Badge className={`${statusColor} text-white`}>
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {getStatusLabel(issue.status)}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {issue.title}
              </h1>
              <p className="text-gray-600">{issue.description}</p>
            </div>
            <div className="ml-6 flex flex-col space-y-2">
              <Button
                onClick={handleFollowToggle}
                className={`${isFollowing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-civic-blue hover:bg-civic-blue/90"}`}
              >
                <Bell className="h-4 w-4 mr-2" />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleUpvote}
                className="text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                {issue.upvotes}
              </Button>
            </div>
          </div>
          
          {/* Issue metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>
                Reported by {issue.isAnonymous ? "Anonymous" : reporter?.username || "Unknown"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(issue.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{issue.address}</span>
            </div>
          </div>
        </div>
        
        {/* Issue images */}
        {issue.images && issue.images.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issue.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Issue photo ${index + 1}`}
                  className="rounded-lg shadow-sm w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Status Timeline */}
        <div className="mb-6">
          <IssueTimeline 
            statusHistory={statusHistory}
            currentStatus={issue.status}
          />
        </div>
        
        {/* Comments Section */}
        <CommentsSection
          comments={comments}
          users={mockUsers}
          onPostComment={handlePostComment}
          onLikeComment={handleLikeComment}
          onFlagComment={handleFlagComment}
        />
      </div>
    </div>
  );
}
