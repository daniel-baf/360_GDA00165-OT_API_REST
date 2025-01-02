import { Route, Routes } from "react-router-dom";
import { ClientProductGrid } from "./products/ClientProductGrid";
import { ClientContextProvider } from "../../../context/user/client/ClientProductGrid.context";

const ClientDashboard: React.FC = () => {
  // TODO save needed data in the context

  return (
    <ClientContextProvider>
      <ClientProductGrid />
    </ClientContextProvider>
  );
};

export default ClientDashboard;
