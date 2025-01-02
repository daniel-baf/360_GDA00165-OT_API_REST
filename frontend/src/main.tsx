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
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Router>
          <App />
        </Router>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </NotificationProvider>
  </StrictMode>
);
