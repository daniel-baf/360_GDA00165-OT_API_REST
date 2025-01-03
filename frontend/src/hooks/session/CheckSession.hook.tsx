// import { useEffect } from "react";
import { NotificationTypes } from "@context/Notification.context";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper"; // Asegúrate de que este path sea correcto
import { useEffect, useState } from "react";
// import { NotificationTypes } from "@context/Notification.context";

const useAuthMiddleware = () => {
  // check current token
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const redirectTo = useRedirectWithMessage();
    if (!token) {
      redirectTo("/", "Debes iniciar sesion", NotificationTypes.ERROR);
      return;
    }
  }, [token]);
};

export default useAuthMiddleware;
