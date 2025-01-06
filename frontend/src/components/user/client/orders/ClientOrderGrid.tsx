import { deleteOrder, fetchOrders } from "@services/orders/orders.service";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import {
  getTokenDecoded,
  PublicTokenPayload,
} from "@helpers/auth/auth.service";
import { NotificationContext } from "@context/Notification.context";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OrderTypes } from "@services/orders/Order.types";
import ClientOrderTuple from "./Tuple/ClientOrderTuple";

const ClientOrderGrid: React.FC = () => {
  const authContext = useAuthContext();
  const notificationContext = useContext(NotificationContext);
  const [orders, setOrders] = useState<OrderTypes[]>();

  // Memoize token_decoded to prevent it from being recomputed on every render
  const token_decoded: PublicTokenPayload["user"] | null = useMemo(() => {
    if (!authContext.token) {
      return null;
    }
    return getTokenDecoded(authContext.token); // Ensure this returns the decoded token
  }, [authContext?.token]);

  // Define reloadProducts as a stable callback
  const reloadProducts = useCallback(() => {
    if (!authContext || !token_decoded) {
      return;
    }

    fetchOrders(`${authContext?.token}`, token_decoded, true, 0).then(
      (data) => {
        setOrders(data);
      }
    );
  }, [authContext, token_decoded]);

  // Trigger reloadProducts when authContext changes
  useEffect(() => {
    reloadProducts();
  }, [reloadProducts]);

  const handleDeleteOrder = (id: number) => {
    deleteOrder(`${authContext?.token}`, id)
      .then((message) => {
        notificationContext?.showSuccess(message);
        // reload orders
        reloadProducts();
      })
      .catch((error) => {
        notificationContext?.showError(`${error}`);
      });
  };

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

      {!!token_decoded && token_decoded.rol_id === 2 && (
        <p className="bg-green-200 text-black px-2 py-1 rounded-full text-center my-4">
          Como administrador, puedes aprobar pedidos.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-600 mt-10">
          <thead className="bg-gray-800">
            <tr className="text-center uppercase">
              <th className="border border-gray-600 px-4 py-2 w-1/12">
                No. Orden
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Creado
              </th>
              <th className="border border-gray-600 px-4 py-2 w-3/12">
                Extras
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Estado
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">Total</th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <React.Fragment key={order.id}>
                <ClientOrderTuple
                  {...order}
                  handleDeleteOrder={handleDeleteOrder}
                  is_admin_logged={token_decoded?.rol_id == 2}
                />
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientOrderGrid;
