import ClientCartSummary from "@components/user/client/cart/subcomponentes/ClientCartSummary";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import { ClientCartProvider } from "@context/user/client/ClientCart.context";
import {
  fetchSearchOrder,
  NewOrderType,
} from "@services/orders/orders.service";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const OrderEditor: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>(); // For path parameters
  const [searchParams] = useSearchParams(); // For query parameters
  const order_id = Number(orderId || searchParams.get("id"));

  const authContex = useAuthContext();
  const [order, setOrder] = useState<NewOrderType | undefined>(undefined);

  useEffect(() => {
    if (!authContex.token) return;
    fetchSearchOrder(order_id, `${authContex.token}`)
      .then((fetched_order) => {
        setOrder(fetched_order);
        // save on local stroage so context is updated
        localStorage.setItem("cart", JSON.stringify(fetched_order.productos));
      })
      .catch((err) => console.error(err));
  }, [authContex.token, order_id]);

  return (
    <div className="container mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Productos en el pedido
      </h1>
      <p className="text-center mb-10">
        Editando la compra del cliente - Solo puedes quitar productos
      </p>
      {order?.productos && (
        <ClientCartProvider>
          <ClientCartSummary products={order?.productos} />
        </ClientCartProvider>
      )}
    </div>
  );
};

export default OrderEditor;
