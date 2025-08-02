import { Clock, AlertCircle, Gavel, CheckCircle } from "lucide-react";
import { StatusHistory } from "@shared/schema";
import { formatTimeAgo } from "@/lib/mock-data";

interface IssueTimelineProps {
  statusHistory: StatusHistory[];
  currentStatus: string;
}

export function IssueTimeline({ statusHistory, currentStatus }: IssueTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return <AlertCircle className="text-white h-4 w-4" />;
      case "in-progress":
        return <Gavel className="text-white h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="text-white h-4 w-4" />;
      default:
        return <Clock className="text-white h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-civic-blue";
      case "in-progress":
        return "bg-civic-amber";
      case "resolved":
        return "bg-civic-emerald";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  // Create timeline with all possible statuses
  const allStatuses = ["reported", "in-progress", "resolved"];
  const timeline = allStatuses.map((status) => {
    const historyItem = statusHistory.find(h => h.status === status);
    const isCompleted = historyItem !== undefined;
    const isPending = !isCompleted && allStatuses.indexOf(status) > allStatuses.indexOf(currentStatus);
    
    return {
      status,
      isCompleted,
      isPending,
      historyItem,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div 
            key={item.status}
            className={`flex items-start space-x-4 ${!item.isCompleted ? "opacity-50" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.isCompleted ? getStatusColor(item.status) : "bg-gray-300"
            }`}>
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">
                  {getStatusLabel(item.status)}
                </span>
                <span className="text-sm text-gray-500">
                  {item.isCompleted && item.historyItem
                    ? formatTimeAgo(item.historyItem.createdAt)
                    : "Pending"
                  }
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {item.historyItem?.description || 
                  (item.status === "in-progress" ? "City maintenance crew assigned to address the issue." :
                   item.status === "resolved" ? "Issue successfully resolved and verified." :
                   "Status update pending")
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
