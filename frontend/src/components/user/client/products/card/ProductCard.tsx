import { ClientCartContext } from "@context/user/client/ClientCart.context";

import { FaCartPlus, FaEdit } from "react-icons/fa";
import { Product } from "../product.types";
import React, { useContext } from "react";
import { PublicTokenPayload } from "@helpers/auth/auth.service";
import { Link } from "react-router-dom";

interface ProductCard extends Product {
  hide_btn?: boolean;
  tokenDecoded: PublicTokenPayload["user"] | null;
}

const ProductCard: React.FC<ProductCard> = ({
  stock,
  estado_producto_id,
  nombre,
  categoria_nombre,
  descripcion,
  precio,
  precio_mayorista,
  hide_btn,
  tokenDecoded,
  estado_nombre,
  id,
}) => {
  const cartContext = useContext(ClientCartContext);

  // Determinamos el color del stock
  const stockColor =
    stock === 0
      ? "text-red-500"
      : stock < 10
      ? "text-yellow-500"
      : "text-green-500";

  // Determinamos la opacidad si el estado es diferente de 1
  const opacityClass = estado_producto_id === 1 ? "" : "opacity-50";

  // function to add a product to the cart, it will show an error if the cart context is not available
  const addProductToCart = (new_product: Product) => {
    cartContext?.add(new_product);
  };

  return (
    <div
      className={`bg-dark dark:bg-gray-800 p-4 rounded-lg shadow-md ${opacityClass}`}
    >
      {/* Nombre del Producto */}
      <h3 className="text-xl font-semibold mb-2 text-gray-100 dark:text-gray-100">
        {nombre}
      </h3>

      {/* Categoría: Mostrar descripción al hover */}
      <div className="relative">
        <span className="text-sm text-gray-300 dark:text-gray-400 cursor-pointer">
          {categoria_nombre}
        </span>
      </div>

      {/* Descripción del Producto */}
      <p className="text-sm text-gray-400 dark:text-gray-300 mt-2">
        {descripcion}
      </p>

      {/* Precios */}
      <div className="mt-3">
        <p className="text-lg text-gray-200 dark:text-gray-100">{`$${precio.toFixed(
          2
        )}`}</p>
        <p className="text-lg text-teal-400 dark:text-primary-500">{`$${precio_mayorista.toFixed(
          2
        )}`}</p>
      </div>

      {/* Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 items-center">
        <p className={`sm:col-span-1 ${stockColor} text-center sm:text-left`}>
          {`Stock: ${stock}`}
        </p>
        {/* BUTTONS SECTION */}
        {!hide_btn && (
          <>
            {tokenDecoded?.rol_id === 2 && (
                <Link
                to={`/dashboard/admin/products/edit?id=${id}`}
                className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded flex justify-center items-center"
                >
                <FaEdit className="inline-block text-lg" />
                </Link>
            )}{" "}
            {tokenDecoded?.rol_id !== 2 && (
              <button
                onClick={() => addProductToCart}
                className={`${
                  stock === 0
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-blue-500 dark:bg-blue-600"
                } text-white px-4 py-2 rounded sm:col-span-1 mt-2 sm:mt-0 w-full sm:w-auto`}
                disabled={stock === 0}
              >
                <FaCartPlus className="inline-block" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Estado del Producto */}
      {estado_producto_id !== 1 && (
        <p className="text-sm font-bold text-right mt-3 text-gray-500 dark:text-gray-400">
          {estado_nombre}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
