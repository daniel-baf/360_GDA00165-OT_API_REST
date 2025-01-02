import { Route, Routes } from "react-router-dom";
import ClientDashboard from "./client/ClentDashboard";

const Dashboard: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/client" element={<ClientDashboard />} />
      </Routes>
    </>
  );
};

export default Dashboard;
