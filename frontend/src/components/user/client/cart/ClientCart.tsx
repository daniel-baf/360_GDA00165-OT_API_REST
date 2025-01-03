import React, { useContext } from "react";
import {
  CartItem,
  ClientCartContext,
} from "@context/user/client/ClientCart.context";
import ClientCartItem from "./ClientCartItem";
import { FaShoppingCart } from "react-icons/fa";
import { Settings } from "CONFIGURATION";

const ClientCart: React.FC = () => {
  const context = useContext(ClientCartContext);
  const [descuento, setDescuento] = React.useState(0);
  const [subtotal, setSubtotal] = React.useState(0);
  if (!context) {
    return;
  }

  const { products } = context;

  // return (

  return (
    <>
      {products?.length === 0 ? (
        <div className="flex-grow mx-auto flex items-center justify-center text-white">
          <div className="text-center p-6 bg-gray-800 shadow-md rounded-lg max-w-sm">
            <FaShoppingCart className="text-gray-400 text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-200">
              ¡Tu carrito está vacío!
            </h2>
            <p className="text-gray-400 mt-2">
              Agrega algunos productos para empezar a comprar.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white flex-grow">
          {/* SUMMARY */}
          <div className="flex justify-center">
            <div className="p-5 shadow-md rounded-lg mb-6 bg-gray-800 w-full md:w-auto">
              <h1 className="text-3xl font-bold mb-4">Resumen de compra</h1>
              <div className="flex justify-between">
                {/* TEXT */}
                <div className="text-end">
                  <p className="text-sky-600 mt-2">
                    Total original: {Settings.CURRENCY_SYMBOL}
                    {(subtotal + descuento).toFixed(2)}
                  </p>
                  <p className="text-green-600 mt-2">
                    Descuento: {Settings.CURRENCY_SYMBOL}
                    {descuento.toFixed(2)}
                  </p>
                  <p className="text-white mt-2 font-bold">
                    Nuevo total: {Settings.CURRENCY_SYMBOL}
                    {subtotal.toFixed(2)}
                  </p>
                </div>
                {/* PAY BUTTONS */}
                <div className="flex items-end">
                  <button className="bg-sky-600 text-white px-4 py-2 rounded-lg mt-4">
                    <FaShoppingCart className="m-2" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 my-4"></div>
            </div>
          </div>

          {/* CART */}
          <div className="container mx-auto">
            <ul>
              {products?.map((product: CartItem) => (
                <ClientCartItem
                  key={product.product.id}
                  product={product}
                  setDescuento={setDescuento}
                  setSubtotal={setSubtotal}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientCart;
