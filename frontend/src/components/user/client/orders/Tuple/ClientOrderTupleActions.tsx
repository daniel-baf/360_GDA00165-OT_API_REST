import { FaTrashAlt, FaCheckCircle, FaEdit, FaBoxOpen } from "react-icons/fa";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import { fetchApproveOrder } from "@services/orders/orders.service";
import { useNotification } from "@context/Notification.context";
import { FaCarRear } from "react-icons/fa6";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

interface ClientOrderTupleActionsProps {
  id: number;
  estado_pedido_id: number;
  is_admin_logged: boolean;
  handleDeleteOrder: (id: number) => void;
  setOrderStatus: React.Dispatch<React.SetStateAction<number>>;
}

const ClientOrderTupleActions: React.FC<ClientOrderTupleActionsProps> = ({
  id,
  estado_pedido_id,
  is_admin_logged,
  handleDeleteOrder,
  setOrderStatus,
}) => {
  const authContext = useAuthContext();
  const notificationContext = useNotification();
  const token = useMemo(() => authContext.token, [authContext.token]);

  const handleChangeStatus = (status: number) => {
    fetchApproveOrder(id, `${token}`, status)
      .then((ok) => {
        setOrderStatus(status); // Update state in parent
        notificationContext.showSuccess(ok);
      })
      .catch((err) => {
        notificationContext.showError(err);
      });
  };

  return (
    <>
      {/* DELETE ORDER */}
      {estado_pedido_id === 1 && (
        <button
          className="bg-red-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-red-600 transition-all duration-200 w-full sm:w-auto"
          onClick={() => handleDeleteOrder(id)}
        >
          <FaTrashAlt />
        </button>
      )}

      {is_admin_logged && (
        <>
          {estado_pedido_id === 1 && (
            <>
              <button
                className="bg-green-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-green-600 transition-all duration-200 w-full sm:w-auto"
                onClick={() => handleChangeStatus(2)}
              >
                <FaCheckCircle />
              </button>
              <Link to={`/dashboard/admin/order/edit?id=${id}`}>
                <button className="bg-orange-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-orange-600 transition-all duration-200 w-full sm:w-auto">
                  <FaEdit />
                </button>
              </Link>
            </>
          )}
          {estado_pedido_id === 2 && (
            <button
              className="bg-blue-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
              onClick={() => handleChangeStatus(3)}
            >
              <FaCarRear />
            </button>
          )}
          {estado_pedido_id === 3 && (
            <button
              className="bg-lime-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-lime-600 transition-all duration-200 w-full sm:w-auto"
              onClick={() => handleChangeStatus(4)}
            >
              <FaBoxOpen />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default ClientOrderTupleActions;
