import { ClientProductGrid } from "@components/user/client/products/ClientProductGrid";
import { ClientPorductsGridProvider } from "@context/user/client/ClientProductGrid.context";
import React from "react";

const AdminProductListChild: React.FC = () => {
  // TODO: agregar ocpiones para que puedan editar, crear... productos
  return (
    <div>
      <ClientProductGrid />
    </div>
  );
};

const AdminProductList: React.FC = () => {
  return (
    <ClientPorductsGridProvider>
      <AdminProductListChild />
    </ClientPorductsGridProvider>
  );
};

export default AdminProductList;
