import { useState, useCallback } from "react";
import { Toast, ToastType } from "@/components/ui/toast-notifications";

export function useToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    title: string,
    description?: string,
    type: ToastType = "info",
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      title,
      description,
      type,
      duration,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(() => ({
    success: (title: string, description?: string, duration?: number) =>
      addToast(title, description, "success", duration),
    error: (title: string, description?: string, duration?: number) =>
      addToast(title, description, "error", duration),
    info: (title: string, description?: string, duration?: number) =>
      addToast(title, description, "info", duration),
    warning: (title: string, description?: string, duration?: number) =>
      addToast(title, description, "warning", duration),
  }), [addToast]);

  return {
    toasts,
    toast,
    removeToast,
  };
}