import { Route, Routes } from "react-router-dom";
import ClientOrderGrid from "../client/orders/ClientOrderGrid";
import OrderEditor from "./orders/OrderEditor";

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientOrderGrid />} />
      <Route path="/order/edit/" element={<OrderEditor />} />
    </Routes>
  );
};

export default AdminDashboard;
