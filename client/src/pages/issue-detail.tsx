import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Edit, Trash2, Share2, Flag, Clock, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockIssues, mockUsers, getStatusColor, formatTimeAgo, getCategoryIcon } from "@/lib/mock-data";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

// Mock activity data
const generateActivityTimeline = (issueId: string) => {
  return [
    {
      id: "1",
      date: "Jun 02, 10:34 AM",
      action: "Reported by user",
      description: "Issue was initially reported by citizen",
      type: "created"
    },
    {
      id: "2", 
      date: "July 26, 09:00 AM",
      action: "Assigned to municipal worker",
      description: "City maintenance team assigned to investigate",
      type: "assigned"
    },
    {
      id: "3",
      date: "July 28, 04:15 PM", 
      action: "Marked 'In Progress'",
      description: "Work has begun on resolving the issue",
      type: "progress"
    }
  ];
};

export default function IssueDetail() {
  const [, params] = useRoute("/issue/:id");
  const { toast } = useToastNotifications();
  
  const issueId = params?.id;
  const issue = mockIssues.find(i => i.id === issueId);
  const reporter = issue?.reporterId ? mockUsers.find(u => u.id === issue.reporterId) : null;
  const activityTimeline = generateActivityTimeline(issueId || "");

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Issue Not Found</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    toast().info("Edit Issue", "Edit functionality will be available soon.", 3000);
  };

  const handleDelete = () => {
    toast().warning("Delete Issue", "Are you sure you want to delete this issue?", 3000);
  };

  const handleReportSpam = () => {
    toast().warning("Report Spam", "Issue has been flagged for review.", 3000);
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                CivicTrack
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-4 max-w-4xl mx-auto">
          <select className="bg-background border border-border rounded px-3 py-1 text-sm">
            <option>Category</option>
            <option>Garbage</option>
            <option>Water</option>
            <option>Roads</option>
          </select>
          <select className="bg-background border border-border rounded px-3 py-1 text-sm">
            <option>Status</option>
            <option>Reported</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="bg-background border border-border rounded px-3 py-1 text-sm">
            <option>Distance</option>
            <option>1km</option>
            <option>5km</option>
            <option>10km</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Issues"
            className="bg-background border border-border rounded px-3 py-1 text-sm ml-auto w-64"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-60">{getCategoryIcon(issue.category)}</span>
              </div>
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
                <h1 className="text-lg font-bold text-foreground">Pothole on main road</h1>
              </div>
            </div>

            {/* Status and Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className={`${getStatusColor(issue.status)} text-white px-3 py-1`}>
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  In Progress
                </Badge>
                <span className="text-muted-foreground">Reported by: Anonymous</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReportSpam}
                className="text-civic-red border-civic-red hover:bg-civic-red hover:text-white"
              >
                Report Spam
              </Button>
            </div>

            {/* Date and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Jun 02, 2025 - 10:34 AM</span>
              </div>
              
              <div className="text-foreground leading-relaxed">
                <p>The main road in c.g road ,ahmeadlbad, is riddled with potholes, making it dangerous and difficult to travel on.</p>
              </div>
            </div>

            {/* Activity Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Activity</h3>
                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-civic-blue rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">{activity.date}</div>
                        <div className="text-foreground font-medium">{activity.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Status</span>
                  <Badge className="bg-civic-amber text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Reported by: Anonymous
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-civic-blue" />
                  <span className="text-sm font-medium text-foreground">Location</span>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  C.G road ,<br />
                  ahmeadabad,<br />
                  gujarat
                </div>
                
                {/* Mini Map */}
                <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-red-500" />
                  </div>
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="border border-gray-300"></div>
                      ))}
                    </div>
                  </div>
                  {/* Location labels */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 rounded">
                    Ahmeadabad
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-1 rounded">
                    Surat
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}