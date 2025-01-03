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
    messageType?: NotificationTypes
  ) => {
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
      default: // no message if no messageType
        break;
    }

    navigate(path);
  };

  return redirectTo;
};

export default useRedirectWithMessage;
