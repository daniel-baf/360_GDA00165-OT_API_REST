import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./components/auth/home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-gray-50 dark:bg-gray-900">
      <Home />
    </div>
  </StrictMode>
);
