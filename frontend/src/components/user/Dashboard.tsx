import { Route, Routes } from "react-router-dom";
import ClientDashboard from "./client/ClentDashboard";
import Footer from "../generic/Footer";
import Header from "../generic/Header";
import AdminDashboard from "./admin/AdminDashboard";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/client/*" element={<ClientDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Dashboard;
