import React, { useState } from "react";
import {
  FaArrowUp,
  FaBoxOpen,
  FaCheckCircle,
  FaExpandAlt,
  FaTrashAlt,
} from "react-icons/fa";
import ClientOrderDetail from "./ClientOrderDetail";

import { OrderTypes } from "@services/orders/Order.types";
import { FaCarRear } from "react-icons/fa6";
import { Settings } from "CONFIGURATION";

interface ClientOrderTupleProps extends OrderTypes {
  handleDeleteOrder: (id: number) => void;
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
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
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
            switch (estado_pedido_id) {
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
          <div className="flex justify-evenly">
            {/* EXPAND CONTENT */}
            <button
              className="bg-slate-200 text-black px-3 py-3 rounded-md shadow-md hover:bg-slate-300 transition-all duration-200"
              onClick={() => toggleExpand(id)}
            >
              {expandedOrderId === id ? <FaArrowUp /> : <FaExpandAlt />}
            </button>
            {/* DELETE ORDER */}
            {estado_pedido_id === 1 && (
              <button
                className="bg-red-500 text-white px-3 py-3 rounded-md shadow-md hover:bg-red-600 transition-all duration-200"
                onClick={() => handleDeleteOrder(id)}
              >
                <FaTrashAlt />
              </button>
            )}
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
