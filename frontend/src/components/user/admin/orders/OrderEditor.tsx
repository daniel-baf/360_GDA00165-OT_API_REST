import ClientCart from "@components/user/client/cart/ClientCart";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import { NotificationTypes } from "@context/Notification.context";
import {
  ClientCartProvider,
  useClientCart,
} from "@context/user/client/ClientCart.context";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper";
import { fetchSearchOrder } from "@services/orders/orders.service";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const OrderEditorChild: React.FC<{ order_id: number }> = ({ order_id }) => {
  const { setProducts } = useClientCart(); // Accede al contexto del carrito
  const authContex = useAuthContext();
  const redirectTo = useRedirectWithMessage();

  useEffect(() => {
    if (!authContex.token) return;
    fetchSearchOrder(order_id, `${authContex.token}`)
      .then((fetched_order) => {
        const productos = fetched_order.productos || [];
        setProducts(productos); // Actualiza el contexto
      })
      .catch((err) => {
        redirectTo("/dashboard/admin/", err.message, NotificationTypes.ERROR);
      });
  }, [authContex.token, order_id, setProducts]); // Asegúrate de que las dependencias no cambien innecesariamente

  return (
    <div className="container mx-auto text-white flex-grow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Productos en el pedido
      </h1>
      <p className="text-center mb-10">
        Editando la compra del cliente - Solo puedes quitar productos
      </p>
      <ClientCart />
    </div>
  );
};

const OrderEditor: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>(); // For path parameters
  const [searchParams] = useSearchParams(); // For query parameters
  const order_id = Number(orderId || searchParams.get("id"));

  return (
    <ClientCartProvider is_edit_id={order_id}>
      <OrderEditorChild order_id={order_id} />
    </ClientCartProvider>
  );
};

export default OrderEditor;
