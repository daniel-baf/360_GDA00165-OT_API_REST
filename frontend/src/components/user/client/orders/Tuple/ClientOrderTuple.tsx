import React, { useState } from "react";
import {
  FaArrowUp,
  FaBoxOpen,
  FaCheckCircle,
  FaExpandAlt,
} from "react-icons/fa";
import ClientOrderDetail from "../ClientOrderDetail";
import { OrderTypes } from "@services/orders/Order.types";
import { FaCarRear } from "react-icons/fa6";
import { Settings } from "CONFIGURATION";
import ClientOrderTupleActions from "./ClientOrderTupleActions";

interface ClientOrderTupleProps extends OrderTypes {
  handleDeleteOrder: (id: number) => void;
  is_admin_logged: boolean;
}

const ClientOrderTuple: React.FC<ClientOrderTupleProps> = ({
  id,
  fecha_creacion,
  fecha_confirmacion,
  fecha_entrega,
  estado_pedido_id,
  estado_nombre,
  details,
  total,
  handleDeleteOrder,
  is_admin_logged,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState(estado_pedido_id); // Correctly connect state to local order status

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <>
      <tr className="bg-gray-700 hover:bg-slate-700">
        <td className="border border-gray-600 px-4 py-2 text-end">{id}</td>
        <td className="border border-gray-600 px-4 py-2 text-center">
          {fecha_creacion}
        </td>
        <td className="border border-gray-600 px-4 py-2">
          <div className="flex flex-col items-start">
            <p className="flex justify-between w-full">
              Validado
              <span className="bg-green-200 text-black px-2 py-1 rounded-full mb-1">
                {fecha_confirmacion || "NA"}
              </span>
            </p>
            <p className="flex justify-between w-full">
              Entregado
              <span className="bg-blue-200 text-black px-2 py-1 rounded-full">
                {fecha_entrega || "NA"}
              </span>
            </p>
          </div>
        </td>
        <td className="border border-gray-600 px-4 py-2 text-center text-sm">
          {(() => {
            switch (orderStatus) {
              case 2:
                return (
                  <div className="flex flex-col items-center">
                    <FaCheckCircle className="text-green-500 text-2xl" />
                    <span className="text-xs">{estado_nombre}</span>
                  </div>
                );
              case 3:
                return (
                  <div className="flex flex-col items-center">
                    <FaCarRear className="text-orange-500 text-2xl" />
                    <span className="text-xs">{estado_nombre}</span>
                  </div>
                );
              case 4:
                return (
                  <div className="flex flex-col items-center">
                    <FaBoxOpen className="text-lime-400 text-2xl" />
                    <span className="text-xs">{estado_nombre}</span>
                  </div>
                );
              default:
                return (
                  <div className="flex flex-col items-center">
                    <FaCheckCircle className="text-yellow-500 text-2xl" />
                    <span className="text-xs">Pendiente</span>
                  </div>
                );
            }
          })()}
        </td>
        <td className="border border-gray-600 px-4 py-2 text-end text-stone-50">
          {Settings.CURRENCY_SYMBOL} {total}
        </td>
        <td className="border border-gray-600 px-4 py-2">
          <div className="flex flex-col sm:flex-row justify-evenly space-y-2 sm:space-y-0 sm:space-x-2">
            {/* EXPAND CONTENT */}
            <button
              className="bg-slate-200 text-black px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-slate-300 transition-all duration-200 w-full sm:w-auto"
              onClick={() => toggleExpand(id)}
            >
              {expandedOrderId === id ? <FaArrowUp /> : <FaExpandAlt />}
            </button>

            <ClientOrderTupleActions
              id={id}
              estado_pedido_id={orderStatus} // Pass the updated state
              is_admin_logged={is_admin_logged}
              handleDeleteOrder={handleDeleteOrder}
              setOrderStatus={setOrderStatus} // Pass state updater function
            />
          </div>
        </td>
      </tr>
      {expandedOrderId === id && details && (
        <ClientOrderDetail order_details={details} />
      )}
    </>
  );
};

export default ClientOrderTuple;
