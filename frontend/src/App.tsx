import { AuthContextProvider } from "./context/auth/signin/Signin.context";
import { Routes, Route } from "react-router-dom";
import Home from "./components/auth/Home";
import Dashboard from "./components/user/Dashboard";

export function App() {
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <AuthContextProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Routes>
            </AuthContextProvider>
          }
        ></Route>
        <Route
          path="*"
          element={
            <div>
              <h1>404</h1>
              <p>Página no encontrada</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}
