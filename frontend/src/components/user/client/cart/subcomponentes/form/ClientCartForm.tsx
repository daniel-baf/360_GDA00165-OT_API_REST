import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import ClientDirectionSelector from "../../../direction/ClientDirectionSelector";
import {
  fetchPutUpdateOrder,
  NewOrderType,
  putNewOrder,
} from "@services/orders/orders.service";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import {
  NotificationTypes,
  useNotification,
} from "@context/Notification.context";
import { getTokenDecoded } from "@helpers/auth/auth.service";
import { FaShoppingCart, FaToolbox } from "react-icons/fa";
import React, { useMemo, useState } from "react";
import {
  CartItem,
  useClientCart,
} from "@context/user/client/ClientCart.context";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper";

interface ClientCartFormProps {
  products: CartItem[];
}

const ClientCartForm: React.FC<ClientCartFormProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authContext = useAuthContext();
  const token = useMemo(() => authContext?.token, [authContext?.token]);
  const { is_edit_id } = useClientCart();
  const decodedTkn = useMemo(() => {
    if (token) {
      return getTokenDecoded(token);
    }
    return undefined;
  }, [token]);
  const notificationContext = useNotification();
  const redirectTo = useRedirectWithMessage();

  const cartContext = useClientCart();
  const [selectedDirection, setSelectedDirection] = useState<
    UserDirectionTypes | undefined
  >(undefined);

  const updateOrder = () => {
    if (!token || !is_edit_id) {
      return;
    }
    // recover the id from the query string
    fetchPutUpdateOrder(`${token}`, is_edit_id, products)
      .then((ok) => {
        redirectTo("/dashboard/admin/order/edit?id=" + ok[1], ok[0], NotificationTypes.SUCCESS);
      })
      .catch((err) => {
        notificationContext.showError(err.message);
      });
  };

  const saveOrder = () => {
    try {
      if (!selectedDirection || !decodedTkn) {
        return;
      }

      const pre_yup_object: NewOrderType = {
        direccion: selectedDirection,
        productos: products,
      };

      putNewOrder(`${token}`, pre_yup_object, decodedTkn.id);
      notificationContext.showSuccess("Orden creada correctamente");
      cartContext.clear();
    } catch (error) {
      notificationContext.showError(`${error}`);
    }
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" ">
      <div className="">
        {decodedTkn?.rol_id === 1 && (
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-lg mt-4 flex flex-col items-center"
            onClick={handleButtonClick}
          >
            <FaShoppingCart className="text-4xl" />
            <span className="text-sm mt-2">Pagar</span>
          </button>
        )}

        {decodedTkn?.rol_id === 2 && (
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-0 flex flex-col items-center"
            onClick={updateOrder}
          >
            <FaToolbox className="text-2xl" />
            <span className="text-sm mt-1">Actualizar</span>
          </button>
        )}
      </div>

      <div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-2/4 h-auto overflow-auto">
              <button
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
                onClick={handleCloseModal}
              >
                X
              </button>
              <h2 className="text-2xl mb-4 dark:text-white">
                Selecciona una dirección
              </h2>
              <ClientDirectionSelector
                handleDirectionClick={setSelectedDirection}
              />

              {/* CONFIRM PURCHASE */}
              {selectedDirection && (
                <div className="mt-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => {
                      saveOrder();
                      handleCloseModal();
                    }}
                  >
                    Confirmar Compra
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCartForm;
