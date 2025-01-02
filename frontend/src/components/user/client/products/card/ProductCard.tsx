import React from "react";
import { Product } from "../product.types";
import { FaCartPlus } from "react-icons/fa";

const ProductCard: React.FC<Product> = (props) => {
  // Determinamos el color del stock
  const stockColor =
    props.stock === 0
      ? "text-red-500"
      : props.stock < 10
      ? "text-yellow-500"
      : "text-green-500";

  // Determinamos la opacidad si el estado es diferente de 1
  const opacityClass = props.estado_producto_id === 1 ? "" : "opacity-50";

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${opacityClass}`}>
      {/* Nombre del Producto */}
      <h3 className="text-xl font-semibold mb-2">{props.nombre}</h3>

      {/* Categoría: Mostrar descripción al hover */}
      <div className="relative">
        <span className="text-sm text-gray-600 cursor-pointer hover:underline">
          {props.categoria_nombre}
        </span>
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 p-2">
          <p className="text-xs text-gray-500">{props.categoria_descripcion}</p>
        </div>
      </div>

      {/* Descripción del Producto */}
      <p className="text-sm text-gray-700 mt-2">{props.descripcion}</p>

      {/* Precios */}
      <div className="mt-3">
        <p className="text-lg text-gray-900">{`$${props.precio.toFixed(2)}`}</p>
        <p className="text-lg text-blue-600">{`$${props.precio_mayorista.toFixed(
          2
        )}`}</p>
      </div>

      {/* Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        <p className={`sm:col-span-1 ${stockColor} text-left`}>
          {`Stock: ${props.stock}`}
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded sm:col-span-1 mt-2 sm:mt-0 w-full sm:w-auto">
          <FaCartPlus className="inline-block" />
        </button>
      </div>

      {/* Estado del Producto */}
      {props.estado_producto_id !== 1 && (
        <p className="text-sm font-bold text-right mt-3 text-gray-500">
          {props.estado_nombre}
        </p>
      )}
    </div>
  );
};

export default ProductCard;
