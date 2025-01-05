import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchProductsCategory } from "@services/products/product.category.service";
import { NotificationContext } from "@context/Notification.context";
import { ProductCategory } from "../product.types";
import { FiSearch } from "react-icons/fi";
import {
  clientProductSearchSchema,
  SearchProductFormValues,
} from "./ClientProductSearch.validations";
import { fetchFilterProduct } from "@services/products/product.service";
import { useClientPorductsGridContext } from "@context/user/client/ClientProductGrid.context";

interface ClientProductFormSearchProps {
  token: string | null;
}

const ClientProductFormSearch: React.FC<ClientProductFormSearchProps> = ({
  token,
}) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const notificManager = useContext(NotificationContext);
  const productContext = useClientPorductsGridContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchProductFormValues>({
    resolver: yupResolver(clientProductSearchSchema),
  });

  useEffect(() => {
    if (!token) return;

    fetchProductsCategory(token)
      .then((ok) => {
        setCategories(ok);
      })
      .catch((error) => {
        notificManager?.showError(error);
      });
  }, [notificManager, token]);

  const onSubmit: SubmitHandler<SearchProductFormValues> = ({
    category,
    search,
  }) => {
    if (!token) {
      notificManager?.showError("No estas autenticado");
      return;
    }
    fetchFilterProduct(token, category, search)
      .then((products) => {
        productContext.handleSearchProducts(products);
      })
      .catch((err) => {
        notificManager?.showError(err.message);
      });
  };

  return (
    <form
      className="w-full flex space-x-4 py-5 mb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <select
          className={`p-2 border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } rounded`}
          {...register("category")}
        >
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-sm">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <input
          type="text"
          placeholder="Search products"
          className={`p-2 border ${
            errors.search ? "border-red-500" : "border-gray-300"
          } rounded`}
          {...register("search")}
        />
        {errors.search && (
          <span className="text-red-500 text-sm">{errors.search.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded flex items-center justify-center px-8"
      >
        <FiSearch className="h-7 w-7" />
      </button>
    </form>
  );
};

export default ClientProductFormSearch;
