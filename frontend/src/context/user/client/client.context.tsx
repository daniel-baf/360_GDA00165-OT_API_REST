import { createContext } from "react";

const ClientContext = createContext(null);

import { ReactNode } from "react";

interface ClientContextProviderProps {
  children: ReactNode;
}

function HomeContextProvider(props: ClientContextProviderProps) {
  return (
    <ClientContext.Provider value={null}>{props.children}</ClientContext.Provider>
  );
}

export { ClientContext, HomeContextProvider };
