import { useClientPorductsGridContext } from "@context/user/client/ClientProductGrid.context";
import ProductCard from "./card/ProductCard";
import { FaSearch } from "react-icons/fa";
import { Product } from "./product.types";
import React, { useEffect } from "react";

const ClientProductGrid: React.FC = () => {
  // use context of cart
  const context = useClientPorductsGridContext();

  const {
    products,
    token,
    loadProducts,
    loadMoreProducts,
    max_products_shown,
  } = context;

  // load the products when the component is mounted
  useEffect(() => {
    loadProducts();
  }, [token]);

  return (
    <div className="flex-grow pb-10">
      <div className="container mx-auto">
        <div className="text-center text-pretty text-4xl pb-4 font-light text-white dark:text-opacity-95">
          Productos
        </div>
        <div>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={`product-${product.id}`}
                  id={product.id}
                  nombre={product.nombre}
                  descripcion={product.descripcion}
                  precio={product.precio}
                  precio_mayorista={product.precio_mayorista}
                  stock={product.stock}
                  estado_producto_id={product.estado_producto_id}
                  categoria_producto_id={product.categoria_producto_id}
                  categoria_nombre={product.categoria_nombre}
                  estado_nombre={product.estado_nombre}
                  categoria_descripcion={product.categoria_descripcion}
                  hide_btn={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl font-semibold mb-4">
                No se han encontrado productos
              </div>
              <div className="text-gray-500 mb-4">
                <i className="react-icons">
                  <FaSearch size={48} />
                </i>
              </div>
              <div className="text-center text-gray-500">
                Pruebe buscar otros productos o espere a que se actualice el
                sistema.
              </div>
            </div>
          )}
        </div>
        {/* BUTTON TO DISPLAY MORE PRODUCTS */}
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreProducts}
            className={`${
              max_products_shown
                ? "bg-gray-500 hover:bg-gray-700 cursor-not-allowed opacity-50"
                : "bg-green-500 hover:bg-green-700"
            } text-white font-bold py-2 px-4 rounded-full flex items-center`}
            disabled={max_products_shown}
          >
            <FaSearch className="mr-2" />
            Cargar más productos
          </button>
        </div>
      </div>
    </div>
  );
};

export { ClientProductGrid };
