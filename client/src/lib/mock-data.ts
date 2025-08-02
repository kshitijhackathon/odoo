import { Issue, User, Comment, StatusHistory } from "@shared/schema";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "sarah_chen",
    email: "sarah@example.com",
    isVerified: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2", 
    username: "mike_johnson",
    email: "mike@example.com",
    isVerified: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    username: "anonymous_user",
    email: "anon@example.com", 
    isVerified: false,
    createdAt: new Date("2024-03-01"),
  },
];

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Overflowing garbage bins on Main Street",
    description: "Multiple garbage bins are overflowing near the intersection of Main St and Oak Ave. Trash is scattered around the area.",
    category: "garbage",
    status: "reported",
    latitude: 40.7128,
    longitude: -74.0060,
    address: "Main St & Oak Ave",
    images: ["https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
    upvotes: 24,
    reporterId: "1",
    isAnonymous: false,
    flagCount: 0,
    isHidden: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Major water leak on Pine Avenue",
    description: "Large water leak causing flooding on Pine Avenue. Water department has been notified and crews are en route.",
    category: "water",
    status: "in-progress",
    latitude: 40.7589,
    longitude: -73.9851,
    address: "Pine Avenue",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
    upvotes: 18,
    reporterId: null,
    isAnonymous: true,
    flagCount: 0,
    isHidden: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Large pothole on Elm Street",
    description: "Dangerous pothole near school zone has been successfully repaired by the city maintenance crew.",
    category: "roads",
    status: "resolved",
    latitude: 40.7505,
    longitude: -73.9934,
    address: "Elm Street",
    images: ["https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
    upvotes: 35,
    reporterId: "2",
    isAnonymous: false,
    flagCount: 0,
    isHidden: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Broken traffic light at 5th and Broadway",
    description: "Traffic light is stuck on red in all directions causing major traffic delays.",
    category: "traffic", 
    status: "flagged",
    latitude: 40.7505,
    longitude: -73.9876,
    address: "5th & Broadway",
    images: [],
    upvotes: 12,
    reporterId: "3",
    isAnonymous: false,
    flagCount: 3,
    isHidden: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    issueId: "1",
    authorId: "2",
    content: "I've also noticed this issue. It's been getting worse over the past week. Thanks for reporting it!",
    parentId: null,
    likes: 3,
    flagCount: 0,
    isHidden: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "2",
    issueId: "1",
    authorId: "3",
    content: "Same here, the smell is getting really bad.",
    parentId: null,
    likes: 1,
    flagCount: 0,
    isHidden: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
];

export const mockStatusHistory: StatusHistory[] = [
  {
    id: "1",
    issueId: "1",
    status: "reported",
    description: "Initial report submitted by Sarah Chen with photos and location details.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2", 
    issueId: "2",
    status: "reported",
    description: "Water leak reported by anonymous user.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    issueId: "2",
    status: "in-progress",
    description: "City maintenance crew assigned to address the issue.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "4",
    issueId: "3",
    status: "reported",
    description: "Pothole reported near school zone.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    issueId: "3",
    status: "in-progress", 
    description: "Road crew dispatched to repair pothole.",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: "6",
    issueId: "3",
    status: "resolved",
    description: "Pothole successfully repaired and verified.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    garbage: "🗑️",
    water: "💧", 
    roads: "🚧",
    traffic: "🚦",
    lighting: "💡",
    parks: "🌳",
    other: "🔧",
  };
  return icons[category] || "🔧";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    reported: "bg-civic-blue",
    "in-progress": "bg-civic-amber", 
    resolved: "bg-civic-emerald",
    flagged: "bg-civic-red",
  };
  return colors[status] || "bg-gray-500";
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
