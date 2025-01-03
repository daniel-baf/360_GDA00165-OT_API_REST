import { ClientProductGrid } from "./products/ClientProductGrid";
import { ClientPorductsGridProvider } from "../../../context/user/client/ClientProductGrid.context";
import ClientCart from "./cart/ClientCart";
import { ClientCartProvider } from "../../../context/user/client/ClientCart.context";
import { Route, Routes } from "react-router-dom";
import ClientOrderGrid from "./orders/ClientOrderGrid";

const ClientDashboard: React.FC = () => {
  return (
    <ClientCartProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ClientPorductsGridProvider>
              <ClientProductGrid />
            </ClientPorductsGridProvider>
          }
        />
        <Route path="cart" element={<ClientCart />} />
        <Route path="orders" element={<ClientOrderGrid />} />
      </Routes>
    </ClientCartProvider>
  );
};

export default ClientDashboard;
