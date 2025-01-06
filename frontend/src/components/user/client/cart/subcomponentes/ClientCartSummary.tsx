import React from "react";
import ClientCartItem from "./ClientCartItem";
import { Settings } from "CONFIGURATION";
import { CartItem } from "@context/user/client/ClientCart.context";
import ClientCartForm from "./form/ClientCartForm";

interface ClientCartSummaryProps {
  products: CartItem[];
  custom_params?: { [key: string]: string };
}

const ClientCartSummary: React.FC<ClientCartSummaryProps> = ({
  products,
}) => {
  // subtotal = ammount of all products by divs, is calculated if the product's quantity changes
  const [total, subtotal] = products.reduce(
    (acc, product) => {
      const productTotal = product.product.precio * product.quantity;
      const productSubtotal =
        product.quantity >= Settings.NUM_MAYORIST
          ? product.product.precio_mayorista * product.quantity
          : product.product.precio * product.quantity;
      return [acc[0] + productTotal, acc[1] + productSubtotal];
    },
    [0, 0]
  );

  return (
    <>
      <div className="text-white flex-grow">
        {/* RESUMEN */}
        <div className="flex justify-center">
          <div className="p-5 shadow-md rounded-lg mb-6 bg-gray-800 w-full md:w-7/12 lg:w-4/12">
            <h1 className="text-2xl font-bold mb-4 text-center uppercase ">
              Resumen de compra
            </h1>
            <div className="flex justify-between">
              <div className="w-1/2 text-end">
                <p className="text-sky-600 mt-2">
                  Total original: {Settings.CURRENCY_SYMBOL}
                  {total.toFixed(2)}
                </p>
                <p className="text-green-600 mt-2">
                  Descuento: {Settings.CURRENCY_SYMBOL}
                  {(total - subtotal).toFixed(2)}
                </p>
                <p className="text-white mt-2 font-bold">
                  Nuevo total: {Settings.CURRENCY_SYMBOL}
                  {subtotal.toFixed(2)}
                </p>
              </div>
              <div className="w-1/2 h-100 flex justify-end items-end">
                <ClientCartForm
                  products={products}
                />
              </div>
            </div>

            <div className="border-t border-gray-700 my-4"></div>
          </div>
        </div>

        {/* CARRITO */}
        <div className="container mx-auto mb-10">
          <ul>
            {products.map((product: CartItem) => (
              <ClientCartItem
                key={`cart-item-${product.product.id}-${product.quantity}`} // Usamos una clave más única
                product={product}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ClientCartSummary;
