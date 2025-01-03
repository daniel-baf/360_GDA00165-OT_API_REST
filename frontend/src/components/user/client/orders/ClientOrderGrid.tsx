import React, { useContext, useEffect, useState } from "react";
import { OrderTypes } from "../../../../services/orders/Order.types";
import { fetchOrders } from "../../../../services/orders/orders.service";
import { AuthContext } from "../../../../context/auth/signin/Signin.context";
import { getTokenDecoded } from "../../../../helpers/auth/auth.service";
import ClientOrderTuple from "./ClientOrderTuple";

const ClientOrderGrid: React.FC<undefined> = () => {
  const authContext = useContext(AuthContext);
  const [orders, setOrders] = useState<OrderTypes[]>();

  useEffect(() => {
    if (!authContext || !authContext?.token) {
      return;
    }

    const token_decoded = getTokenDecoded(`${authContext?.token}`);
    if (!token_decoded) {
      return;
    }

    fetchOrders(`${authContext?.token}`, token_decoded?.id, true, 0).then(
      (data) => {
        setOrders(data);
      }
    );
  }, [authContext, authContext?.token]);

  return (
    <div className="flex-grow container mx-auto text-stone-200 mb-10">
      <h1 className="text-4xl font-bold text-center my-4">Ordenes</h1>
      <p>
        Resumen de las ordenes que haz hecho, ordenadas por fecha, solamente
        puedes{" "}
        <span className="bg-yellow-200 text-black px-2 py-1 rounded-full">
          cancelar
        </span>{" "}
        las que no hayan sido{" "}
        <span className="bg-yellow-200 text-black px-2 py-1 rounded-full">
          aprobadas
        </span>
      </p>

      <table className="w-full border-collapse border-2 border-gray-600 mt-10">
        <thead className="bg-gray-800 ">
          <tr className=" text-center uppercase">
            <th className="border border-gray-600 px-4 py-2 w-1/12">No. Orden</th>
            <th className="border border-gray-600 px-4 py-2 w-2/12">Creado</th>
            <th className="border border-gray-600 px-4 py-2 w-3/12">Extras</th>
            <th className="border border-gray-600 px-4 py-2 w-2/12">Estado</th>
            <th className="border border-gray-600 px-4 py-2 w-2/12">Total</th>
            <th className="border border-gray-600 px-4 py-2 w-2/12">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <React.Fragment key={order.id}>
              <ClientOrderTuple {...order} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientOrderGrid;
