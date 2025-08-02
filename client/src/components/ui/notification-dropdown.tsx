import { useState } from "react";
import { Bell, X, Check, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/mock-data";

interface Notification {
  id: string;
  type: 'status_update' | 'new_comment' | 'new_issue' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  issueId?: string;
  location?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "status_update",
    title: "Issue Status Updated",
    message: "Your reported pothole on C.G Road has been marked 'In Progress'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    issueId: "1",
    location: "C.G Road, Ahmedabad"
  },
  {
    id: "2",
    type: "new_comment",
    title: "New Comment",
    message: "Municipal Worker added a comment on your water issue report",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    issueId: "2",
    location: "Ellis Bridge"
  },
  {
    id: "3",
    type: "new_issue",
    title: "New Issue Nearby",
    message: "Street lighting issue reported 0.5km from your location",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    issueId: "3",
    location: "Law Garden Area"
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "CivicTrack maintenance scheduled for tonight 2:00 AM - 4:00 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  }
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_update':
        return <Clock className="h-4 w-4 text-civic-blue" />;
      case 'new_comment':
        return <AlertCircle className="h-4 w-4 text-civic-amber" />;
      case 'new_issue':
        return <MapPin className="h-4 w-4 text-civic-red" />;
      case 'system':
        return <Bell className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <Card className="absolute top-12 right-0 w-96 max-h-96 z-50 shadow-2xl border border-border bg-background overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-civic-blue hover:text-civic-blue hover:bg-civic-blue/10"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-civic-blue/5 border-l-4 border-l-civic-blue' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          {notification.location && (
                            <div className="flex items-center space-x-1 mt-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.location}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-6 w-6 text-civic-blue hover:bg-civic-blue/10"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-civic-blue hover:text-civic-blue hover:bg-civic-blue/10"
            >
              View All Notifications
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}