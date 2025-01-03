import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ClientDirectionSelector from "../../../direction/ClientDirectionSelector";
import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import {
  CartItem,
  useClientCart,
} from "@context/user/client/ClientCart.context";
import { NewOrderType, putNewOrder } from "./order.service";
import { useAuthContext } from "@context/auth/signin/Signin.context";
import { getTokenDecoded } from "@helpers/auth/auth.service";
import { useNotification } from "@context/Notification.context";

interface ClientCartFormProps {
  products: CartItem[];
}

const ClientCartForm: React.FC<ClientCartFormProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authContext = useAuthContext();
  const notificationContext = useNotification();
  const cartContext = useClientCart();
  const [selectedDirection, setSelectedDirection] = useState<
    UserDirectionTypes | undefined
  >(undefined);

  const saveOrder = () => {
    try {
      const decodedTkn = getTokenDecoded(`${authContext?.token}`);
      if (!selectedDirection || !decodedTkn) {
        return;
      }

      const pre_yup_object: NewOrderType = {
        direccion: selectedDirection,
        productos: products,
      };

      putNewOrder(`${authContext?.token}`, pre_yup_object, decodedTkn.id);
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
    <div className="flex justify-end">
      <button
        className="bg-sky-600 text-white px-4 py-2 rounded-lg mt-4"
        onClick={handleButtonClick}
      >
        <FaShoppingCart className="m-2" />
        <span className="ml-2">Pagar</span>
      </button>

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
  );
};

export default ClientCartForm;
