import { ClientProductGrid } from "@components/user/client/products/ClientProductGrid";
import { ClientPorductsGridProvider } from "@context/user/client/ClientProductGrid.context";
import React from "react";

const AdminCategoryListChild: React.FC = () => {
  return (
    <div>
      <ClientProductGrid />
    </div>
  );
};

const AdminCategoryList: React.FC = () => {
  return (
    <ClientPorductsGridProvider>
      <AdminCategoryListChild />
    </ClientPorductsGridProvider>
  );
};

export default AdminCategoryList;
