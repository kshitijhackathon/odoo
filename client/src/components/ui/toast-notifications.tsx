import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastNotificationsProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconProps = { className: "h-5 w-5" };
  
  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="h-5 w-5 text-civic-emerald" />;
    case "error":
      return <AlertCircle {...iconProps} className="h-5 w-5 text-civic-red" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="h-5 w-5 text-civic-amber" />;
    case "info":
    default:
      return <Info {...iconProps} className="h-5 w-5 text-civic-blue" />;
  }
};

const ToastNotification = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-remove after duration
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 200);
    }, toast.duration || 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-white dark:bg-gray-800 border-l-4 border-l-civic-emerald";
      case "error":
        return "bg-white dark:bg-gray-800 border-l-4 border-l-civic-red";
      case "warning":
        return "bg-white dark:bg-gray-800 border-l-4 border-l-civic-amber";
      case "info":
      default:
        return "bg-white dark:bg-gray-800 border-l-4 border-l-civic-blue";
    }
  };

  return (
    <div
      className={`
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
        transition-all duration-300 transform
        ${getBackgroundColor()}
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isExiting ? "scale-95" : "scale-100"}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ToastIcon type={toast.type} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {toast.title}
            </p>
            {toast.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {toast.description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={handleRemove}
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ToastNotifications({ toasts, onRemove }: ToastNotificationsProps) {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}