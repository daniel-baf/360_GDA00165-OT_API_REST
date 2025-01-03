import { ClientPorductsGridProvider } from "@context/user/client/ClientProductGrid.context";
import { ClientCartProvider } from "@context/user/client/ClientCart.context";
import { ClientProductGrid } from "./products/ClientProductGrid";
import ClientOrderGrid from "./orders/ClientOrderGrid";
import { Route, Routes } from "react-router-dom";
import ClientCart from "./cart/ClientCart";

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
