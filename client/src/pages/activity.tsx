import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ThumbsUp, MessageCircle, Flag, Eye, Calendar, TrendingUp, Award } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockIssues, mockComments, mockUsers, getCategoryIcon, formatTimeAgo } from "@/lib/mock-data";

interface ActivityItem {
  id: string;
  type: "upvote" | "comment" | "report" | "follow" | "achievement";
  timestamp: Date;
  issue?: any;
  comment?: any;
  description: string;
  points?: number;
}

export default function Activity() {
  // Mock current user ID
  const currentUserId = "user-1";
  const currentUser = mockUsers.find(u => u.id === currentUserId);
  
  // Generate mock activity data
  const generateActivity = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Recent upvotes
    mockIssues.slice(0, 5).forEach((issue, index) => {
      activities.push({
        id: `upvote-${index}`,
        type: "upvote",
        timestamp: new Date(Date.now() - index * 86400000), // Last 5 days
        issue,
        description: `You upvoted "${issue.title}"`,
        points: 1
      });
    });
    
    // Recent comments
    mockComments.slice(0, 3).forEach((comment, index) => {
      const issue = mockIssues.find(i => i.id === comment.issueId);
      activities.push({
        id: `comment-${index}`,
        type: "comment",
        timestamp: new Date(Date.now() - (index + 1) * 43200000), // Last 3 days
        issue,
        comment,
        description: `You commented on "${issue?.title}"`,
        points: 2
      });
    });
    
    // Reports submitted
    mockIssues.filter(i => i.reporterId === currentUserId).slice(0, 2).forEach((issue, index) => {
      activities.push({
        id: `report-${index}`,
        type: "report",
        timestamp: new Date(Date.now() - (index + 2) * 86400000),
        issue,
        description: `You reported "${issue.title}"`,
        points: 5
      });
    });

    // Achievements
    activities.push({
      id: "achievement-1",
      type: "achievement",
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      description: "Earned 'Community Helper' badge for reporting 5 issues",
      points: 50
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const [activityData] = useState<ActivityItem[]>(generateActivity());
  
  // Calculate statistics
  const totalPoints = activityData.reduce((sum, activity) => sum + (activity.points || 0), 0);
  const weeklyActivity = activityData.filter(a => 
    a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const monthlyActivity = activityData.filter(a => 
    a.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upvote": return <ThumbsUp className="h-4 w-4 text-civic-blue" />;
      case "comment": return <MessageCircle className="h-4 w-4 text-civic-emerald" />;
      case "report": return <Flag className="h-4 w-4 text-civic-amber" />;
      case "follow": return <Eye className="h-4 w-4 text-purple-500" />;
      case "achievement": return <Award className="h-4 w-4 text-yellow-500" />;
      default: return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "upvote": return "Upvote";
      case "comment": return "Comment";
      case "report": return "Report";
      case "follow": return "Follow";
      case "achievement": return "Achievement";
      default: return "Activity";
    }
  };

  const ActivityCard = ({ activity }: { activity: ActivityItem }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs">
                {getActivityTypeLabel(activity.type)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
            <p className="text-sm text-foreground mb-2">{activity.description}</p>
            
            {activity.issue && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{getCategoryIcon(activity.issue.category)}</span>
                <span>{activity.issue.category}</span>
                <span>•</span>
                <span>{activity.issue.address || "Location not specified"}</span>
              </div>
            )}
            
            {activity.points && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-civic-emerald font-medium">
                  +{activity.points} points
                </span>
                {activity.issue && (
                  <Link href={`/issue/${activity.issue.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                      View Issue
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
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
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-civic-blue text-white text-lg">
                {currentUser?.username.slice(0, 2).toUpperCase() || "SC"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {currentUser?.username || "Sarah Chen"}
              </h1>
              <p className="text-muted-foreground">
                Community member since {currentUser?.createdAt?.toLocaleDateString() || "January 2024"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">
                Civic engagement score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-civic-emerald" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyActivity}</div>
              <p className="text-xs text-muted-foreground">
                Activities completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-civic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyActivity}</div>
              <p className="text-xs text-muted-foreground">
                Total activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank</CardTitle>
              <div className="h-4 w-4 bg-civic-amber rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#12</div>
              <p className="text-xs text-muted-foreground">
                Community leaderboard
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="votes">Votes</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {activityData.length > 0 ? (
              <div className="space-y-3">
                {activityData.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
                  <p className="text-muted-foreground text-center">
                    Start engaging with the community to see your activity here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {activityData.filter(a => a.type === "report").map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            {activityData.filter(a => a.type === "upvote").map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {activityData.filter(a => a.type === "comment").map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {/* Current Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Your Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Community Helper</h4>
                        <p className="text-sm text-muted-foreground">Reported 5 issues</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">+50 pts</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-civic-blue rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Active Voter</h4>
                        <p className="text-sm text-muted-foreground">Upvoted 10 issues</p>
                      </div>
                    </div>
                    <Badge className="bg-civic-blue text-white">+25 pts</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Activity */}
              {activityData.filter(a => a.type === "achievement").map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}