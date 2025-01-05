import { Route, Routes } from "react-router-dom";
import ClientOrderGrid from "../client/orders/ClientOrderGrid";
import OrderEditor from "./orders/OrderEditor";
import { ClientCartProvider } from "@context/user/client/ClientCart.context";

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientOrderGrid />} />
      <Route
        path="/order/edit/"
        element={
          <ClientCartProvider>
            <OrderEditor />
          </ClientCartProvider>
        }
      />
    </Routes>
  );
};

export default AdminDashboard;
