import React, { createContext, useCallback } from "react";
import { toast } from "react-toastify";

export enum NotificationTypes {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
}

interface NotificationContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return (
    <NotificationContext.Provider value={{ showError, showSuccess, showInfo }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export { NotificationContext, NotificationProvider, useNotification };
