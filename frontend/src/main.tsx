import { NotificationProvider } from "./context/Notification.context";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-gray-800 dark:bg-gray-900 flex flex-col min-h-screen">
      <NotificationProvider>
        <Router>
          <App />
        </Router>
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          limit={5} 
          newestOnTop 
        />
      </NotificationProvider>
    </div>
  </StrictMode>
);
