import { Route, Routes } from "react-router-dom";
import ClientOrderGrid from "../client/orders/ClientOrderGrid";
import OrderEditor from "./orders/OrderEditor";
import { ClientCartProvider } from "@context/user/client/ClientCart.context";
import AdminCategoryList from "./products/categories/AdminCategoryList";

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
      <Route path="/products" element={<AdminCategoryList />} />
    </Routes>
  );
};

export default AdminDashboard;
