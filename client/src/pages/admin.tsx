import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Flag, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  UserX
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockIssues, mockUsers, getCategoryIcon, getStatusColor } from "@/lib/mock-data";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

export default function AdminDashboard() {
  const { toast } = useToastNotifications();
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [hiddenIssues, setHiddenIssues] = useState<Set<string>>(new Set());

  // Analytics calculations
  const totalIssues = mockIssues.length;
  const flaggedIssues = mockIssues.filter(issue => issue.flagCount && issue.flagCount > 0);
  const resolvedIssues = mockIssues.filter(issue => issue.status === "resolved");
  const activeUsers = mockUsers.filter(user => user.isVerified).length;

  const categoryStats = mockIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusStats = mockIssues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleBanUser = (userId: string, username: string) => {
    setBannedUsers(prev => new Set([...prev, userId]));
    toast().warning(
      "User banned",
      `${username} has been temporarily banned from the platform.`,
      3000
    );
  };

  const handleUnbanUser = (userId: string, username: string) => {
    setBannedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    toast().success(
      "User unbanned",
      `${username} has been restored to the platform.`,
      3000
    );
  };

  const handleHideIssue = (issueId: string, title: string) => {
    setHiddenIssues(prev => new Set([...prev, issueId]));
    toast().info(
      "Issue hidden",
      `"${title}" has been hidden from public view.`,
      3000
    );
  };

  const handleShowIssue = (issueId: string, title: string) => {
    setHiddenIssues(prev => {
      const newSet = new Set(prev);
      newSet.delete(issueId);
      return newSet;
    });
    toast().success(
      "Issue restored",
      `"${title}" is now visible to the public.`,
      3000
    );
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform activity, review flagged content, and manage users
          </p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Flag className="h-4 w-4" />
              <span>Flagged Reports</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalIssues}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
                  <CheckCircle className="h-4 w-4 text-civic-emerald" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resolvedIssues.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {((resolvedIssues.length / totalIssues) * 100).toFixed(1)}% resolution rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockUsers.length - activeUsers} anonymous users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Reports</CardTitle>
                  <AlertCircle className="h-4 w-4 text-civic-red" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{flaggedIssues.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Require review
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category and Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(categoryStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        <span className="capitalize font-medium">{category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-civic-blue h-2 rounded-full"
                            style={{ width: `${(count / totalIssues) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issues by Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(statusStats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                        <span className="capitalize font-medium">{status.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStatusColor(status)}`}
                            style={{ width: `${(count / totalIssues) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Reports Requiring Review</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and take action on community-flagged issues
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className="border rounded-lg p-4 space-y-3 bg-card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                            <h3 className="font-semibold text-foreground">{issue.title}</h3>
                            <Badge variant="destructive">
                              {issue.flagCount} flag{issue.flagCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {issue.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Reported by: {issue.isAnonymous ? "Anonymous" : 
                              mockUsers.find(u => u.id === issue.reporterId)?.username || "Unknown"}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {hiddenIssues.has(issue.id) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowIssue(issue.id, issue.title)}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Show</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHideIssue(issue.id, issue.title)}
                              className="flex items-center space-x-1"
                            >
                              <EyeOff className="h-4 w-4" />
                              <span>Hide</span>
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleHideIssue(issue.id, issue.title)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {flaggedIssues.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No flagged reports at this time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage user accounts and review user activity
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div 
                      key={user.id}
                      className="border rounded-lg p-4 bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.username.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{user.username}</h3>
                              {user.isVerified && (
                                <Badge variant="default" className="bg-civic-emerald">
                                  Verified
                                </Badge>
                              )}
                              {bannedUsers.has(user.id) && (
                                <Badge variant="destructive">
                                  Banned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Member since {user.createdAt?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {bannedUsers.has(user.id) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnbanUser(user.id, user.username)}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Unban</span>
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleBanUser(user.id, user.username)}
                              className="flex items-center space-x-1"
                            >
                              <UserX className="h-4 w-4" />
                              <span>Ban</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}