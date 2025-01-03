import React from "react";
import {
  CartItem,
  useClientCart,
} from "@context/user/client/ClientCart.context";
import ProductCard from "../../products/card/ProductCard";
import { FaMinusCircle, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { Settings } from "CONFIGURATION";

interface ClientCartItemProps {
  product: CartItem;
}

const ClientCartItem: React.FC<ClientCartItemProps> = ({ product }) => {
  const context = useClientCart;
  const { add, remove, decrease } = context();

  const subtotal =
    product.quantity *
    (product.quantity >= Settings.NUM_MAYORIST
      ? product.product.precio_mayorista
      : product.product.precio);

  const raw_product = product.product;

  return (
    <li className="bg-gray-500 p-4 rounded-lg shadow-md mb-4">
      <div className="flex h-100">
        {/* Información principal del producto */}
        <div className="flex flex-col w-3/4 h-full">
          <ProductCard
            key={`product-${raw_product.id}`}
            id={raw_product.id}
            nombre={raw_product.nombre}
            descripcion={raw_product.descripcion}
            precio={raw_product.precio}
            precio_mayorista={raw_product.precio_mayorista}
            stock={raw_product.stock}
            estado_producto_id={raw_product.estado_producto_id}
            categoria_producto_id={raw_product.categoria_producto_id}
            categoria_nombre={raw_product.categoria_nombre}
            estado_nombre={raw_product.estado_nombre}
            categoria_descripcion={raw_product.categoria_descripcion}
            hide_btn={true}
          />
        </div>

        <div className="flex flex-col w-1/4 h-100 p-4">
          {/* Resumen a la derecha */}
          <div className="text-right grow text-white">
            <div>
              <strong>PRECIO:</strong> {raw_product.precio.toFixed(2)}
            </div>
            <div>
              <strong>CANTIDAD:</strong> {product.quantity.toFixed(0)}
            </div>
            <div>
              <strong>SUBTOTAL:</strong> {subtotal.toFixed(2)}
            </div>
            <div>
              <strong>DESCUENTO:</strong>{" "}
              {(raw_product.precio * product.quantity - subtotal).toFixed(2)}
            </div>
          </div>
          <div className="flex-none">
            {/* Botones para agregar o quitar productos */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  add(raw_product);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                <FaPlusCircle />
              </button>
              <button
                onClick={() => {
                  remove(raw_product);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                <FaTrashAlt />
              </button>
              <button
                onClick={() => {
                  decrease(raw_product);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              >
                <FaMinusCircle />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ClientCartItem;
