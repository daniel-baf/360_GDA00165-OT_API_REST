import {
  NotificationContext,
  NotificationTypes,
} from "@context/Notification.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const useRedirectWithMessage = () => {
  const notificationContext = useContext(NotificationContext);
  const navigate = useNavigate();

  const redirectTo = (
    path: string,
    message?: string,
    messageType?: NotificationTypes,
    dataToSend?: unknown // New parameter to send data
  ) => {
    // Show the appropriate notification based on messageType
    switch (messageType) {
      case NotificationTypes.ERROR:
        notificationContext?.showError(`${message}`);
        break;
      case NotificationTypes.SUCCESS:
        notificationContext?.showSuccess(`${message}`);
        break;
      case NotificationTypes.INFO:
        notificationContext?.showInfo(`${message}`);
        break;
      default:
        break;
    }

    // Redirect with the state containing dataToSend
    navigate(path, { state: dataToSend });
  };

  return redirectTo;
};

export default useRedirectWithMessage;
