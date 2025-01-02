import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "./context/Notification.context";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-gray-800 dark:bg-gray-900 flex flex-col min-h-screen">
      <NotificationProvider>
        <Router>
          <App />
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </NotificationProvider>
    </div>
  </StrictMode>
);
