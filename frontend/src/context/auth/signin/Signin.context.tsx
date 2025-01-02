/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode, useState, useEffect } from "react";

// Context type definitions
interface AuthContextType {
  saveToken: (newToken: string) => void;
  clearToken: () => void;
}

// Provider props
interface AuthContextProviderProps {
  children: ReactNode;
}

// Modificación en el contexto
const AuthContext = createContext<
  (AuthContextType & { token: string | null }) | undefined
>(undefined);

// Ajusta el proveedor
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ saveToken, clearToken, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
