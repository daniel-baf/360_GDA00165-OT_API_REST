import { Route, Routes } from "react-router-dom";
import ClientDashboard from "./client/ClentDashboard";
import Footer from "../generic/Footer";
import Header from "../generic/Header";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/client/*" element={<ClientDashboard />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Dashboard;
