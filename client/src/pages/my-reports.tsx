import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Calendar, MapPin, Clock, Eye, Trash2, Edit, Flag } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockIssues, mockUsers, getStatusColor, getCategoryIcon, formatTimeAgo } from "@/lib/mock-data";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

export default function MyReports() {
  const [, setLocation] = useLocation();
  const { toast } = useToastNotifications();
  
  // Mock current user ID - in real app this would come from auth context
  const currentUserId = "user-1";
  
  // Filter issues by current user
  const myIssues = mockIssues.filter(issue => issue.reporterId === currentUserId);
  
  // Categorize issues by status
  const draftIssues = myIssues.filter(issue => issue.status === "reported");
  const activeIssues = myIssues.filter(issue => ["reported", "in-progress"].includes(issue.status));
  const resolvedIssues = myIssues.filter(issue => issue.status === "resolved");

  const handleViewIssue = (issueId: string) => {
    setLocation(`/issue/${issueId}`);
  };

  const handleEditIssue = (issueId: string) => {
    toast().info("Edit Issue", "Editing functionality will be available soon.", 3000);
  };

  const handleDeleteIssue = (issueId: string, title: string) => {
    toast().warning("Issue Deleted", `"${title}" has been deleted from your reports.`, 3000);
  };

  const IssueCard = ({ issue, showActions = true }: { issue: any; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(issue.category)}</span>
            <h3 className="font-semibold text-foreground line-clamp-1">{issue.title}</h3>
          </div>
          <Badge className={`${getStatusColor(issue.status)} text-white`}>
            {issue.status.replace("-", " ")}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {issue.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatTimeAgo(issue.createdAt || new Date())}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{issue.address || "Location not specified"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{Math.floor(Math.random() * 50) + 10} views</span>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewIssue(issue.id)}
                className="text-civic-blue border-civic-blue hover:bg-civic-blue hover:text-white"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditIssue(issue.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {issue.upvotes || 0} upvotes
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteIssue(issue.id, issue.title)}
                className="text-civic-red hover:text-civic-red p-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Reports</h1>
          <p className="text-muted-foreground">
            Manage and track all the issues you've reported to the community
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Issues you've reported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-civic-amber" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently being worked on
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <div className="h-4 w-4 bg-civic-emerald rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedIssues.length}</div>
              <p className="text-xs text-muted-foreground">
                Successfully fixed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
              <div className="h-4 w-4 bg-civic-blue rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myIssues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Community support received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Issues Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Reports ({myIssues.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeIssues.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedIssues.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {myIssues.length > 0 ? (
              <div className="grid gap-4">
                {myIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Flag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No reports yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    You haven't reported any issues yet. Start by reporting a problem in your area.
                  </p>
                  <Link href="/">
                    <Button className="bg-civic-blue hover:bg-civic-blue/90">
                      Report Your First Issue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeIssues.length > 0 ? (
              <div className="grid gap-4">
                {activeIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No active reports</h3>
                  <p className="text-muted-foreground text-center">
                    You don't have any issues currently being worked on.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedIssues.length > 0 ? (
              <div className="grid gap-4">
                {resolvedIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 bg-civic-emerald rounded-full flex items-center justify-center mb-4">
                    <Flag className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No resolved reports</h3>
                  <p className="text-muted-foreground text-center">
                    None of your reported issues have been resolved yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Edit className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No drafts</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any draft reports saved.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}