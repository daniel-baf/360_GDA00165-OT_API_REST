import React from "react";
import { OrderDetailTypes } from "@services/orders/Order.types";
import { Settings } from "CONFIGURATION";

interface ClientOrderDetailProps {
  order_details: OrderDetailTypes[];
}

const ClientOrderDetail: React.FC<ClientOrderDetailProps> = ({
  order_details,
}) => {
  return (
    <tr className="bg-gray-600 text-gray-100">
      <td colSpan={6} className="border border-gray-500">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-50">
            Detalles del pedido
          </h2>
          <table className="w-full border-collapse border border-gray-500">
            <thead className="bg-gray-900 text-gray-100">
              <tr className="text-center uppercase">
                <th className="border border-gray-500 px-4 py-2 w-5/12">
                  Producto
                </th>
                <th className="border border-gray-500 px-4 py-2 w-1/12">
                  Cantidad
                </th>
                <th className="border border-gray-500 px-4 py-2 w-3/12">
                  Precio
                </th>
                <th className="border border-gray-500 px-4 py-2 w-3/12">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order_details.map((detail) => (
                <tr
                  key={detail.id}
                  className="hover:bg-gray-600 odd:bg-gray-700 even:bg-gray-800"
                >
                  <td className="border border-gray-500 px-4 py-2 uppercase">
                    {detail.producto_nombre}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {detail.cantidad}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-end">
                    {Settings.CURRENCY_SYMBOL}
                    {detail.precio_venta.toFixed(2)}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-end">
                    {Settings.CURRENCY_SYMBOL}
                    {detail.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};

export default ClientOrderDetail;
