import { Route, Routes } from "react-router-dom";
import ClientOrderGrid from "../client/orders/ClientOrderGrid";
import OrderEditor from "./orders/OrderEditor";
import { ClientCartProvider } from "@context/user/client/ClientCart.context";
import AdminProductList from "./products/AdminProductList";
import AdminCategoryList from "./products/categories/AdminCategoryList";
import AdminUserDashboard from "./users/AdminUserDashboard";

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
      <Route path="/products" element={<AdminProductList />} />
      <Route path="/categories" element={<AdminCategoryList />} />
      <Route path="/users" element={<AdminUserDashboard />} />
    </Routes>
  );
};

export default AdminDashboard;
