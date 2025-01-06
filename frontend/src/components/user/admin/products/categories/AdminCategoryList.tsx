import { ProductCategory } from "@components/user/client/products/product.types";
import { AuthContext } from "@context/auth/signin/Signin.context";
import { NotificationContext } from "@context/Notification.context";
import {
  fetchCreateProductCategory,
  fetchDeleteProductCategory,
  fetchProductsCategory,
  fetchUpdateCategory,
} from "@services/products/product.category.service";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import AdminCategoryCreate from "./form/AdminCategoryCreate";
import Modal from "@components/generic/Modal";
import { FormDataCategoryCreate } from "./form/AdminCategoryCreate.validations";

const AdminCategoryList: React.FC = () => {
  const authContext = useContext(AuthContext);
  const notifications = useContext(NotificationContext);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editedCategory, setEditedCategory] = useState<ProductCategory | null>(
    null
  );

  const onSubmitCreate = (data: FormDataCategoryCreate) => {
    // CALL API TO CREATE CATEGORY
    if (!authContext?.token) return;
    fetchCreateProductCategory(authContext?.token, data)
      .then((ok) => {
        notifications?.showSuccess("Categoria creada con exito, id: " + ok.id);
        setCategories((prev) => [...prev, ok]);
      })
      .catch((error) => {
        notifications?.showError(error);
      });
  };

  const onsSubmitEdit = (data: FormDataCategoryCreate) => {
    // CALL API TO CREATE CATEGORY
    if (!authContext?.token || !data.id) return;
    fetchUpdateCategory(authContext.token, data.id, data)
      .then((ok) => {
        notifications?.showSuccess("Categoria actualizada, con id: " + ok.id);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === data.id
              ? {
                  ...category,
                  nombre: data.nombre ?? category.nombre,
                  descripcion: data.descripcion ?? category.descripcion,
                }
              : category
          )
        );
      })
      .catch((error) => {
        notifications?.showError(error);
      });
  };

  const handleDeleteCategory = (id: number) => {
    if (!authContext?.token) return;
    fetchDeleteProductCategory(authContext?.token, id)
      .then((ok) => {
        notifications?.showSuccess("Se ha borrado la categoria, id: " + ok.id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((error) => {
        notifications?.showError(error.message);
      });
  };

  const handleEditCategory = (index: number) => {
    setEditedCategory(categories[index]); // Configura los valores que quieres editar
    const editButton = document.querySelector(
      "#edit-category-button"
    ) as HTMLButtonElement;
    editButton?.click();
  };

  useEffect(() => {
    if (!authContext?.token) return;

    fetchProductsCategory(authContext.token)
      .then((ok) => {
        setCategories(ok);
      })
      .catch((error) => {
        notifications?.showError(error);
      });
  }, [authContext?.token, notifications]);

  return (
    <div className="container mx-auto flex-grow text-stone-200">
      <div>
        <h1 className="text-2xl font-bold mb-4">Categorias</h1>
        <p className="mb-4">Crea edita o elimina productos</p>
      </div>

      <div className="flex w-100 justify-end">
        {/* MODAL */}
        <Modal
          title="Nueva categoria"
          width="500px"
          description="Crea una nueva categoria, el ID sera generado automaticamente"
          triggerButton={
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200">
              <FaPlusCircle className="inline-block mr-2" /> Crear
            </button>
          }
          content={<AdminCategoryCreate onSubmit={onSubmitCreate} />}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-600 mt-10">
          <thead className="bg-gray-800">
            <tr className="text-center uppercase">
              <th className="border border-gray-600 px-4 py-2 w-1/12">
                CODIGO
              </th>
              <th className="border border-gray-600 px-4 py-2 w-3/12">
                NOMBRE
              </th>
              <th className="border border-gray-600 px-4 py-2 w-auto">
                Descripcion
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="bg-gray-700 hover:bg-slate-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {category.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {category.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {category.descripcion}
                </td>
                <td>
                  {/* ACTIONS */}
                  <div className="flex justify-center space-x-4 w-100">
                    <button
                      className="bg-red-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="bg-yellow-600 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                      onClick={() => handleEditCategory(index)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HIDDEN MODAL TO DISPLAY */}
      <div>
        <Modal
          key="edit-category-modal"
          title="Editar categoria"
          description="Estas editando una categoria, el id no cambiara"
          triggerButton={
            <button
              hidden
              id="edit-category-button"
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
            >
              Editar
            </button>
          }
          content={
            <AdminCategoryCreate
              id={editedCategory?.id}
              nombre={editedCategory?.nombre}
              descripcion={editedCategory?.descripcion}
              onSubmit={onsSubmitEdit}
            />
          }
          width="500px"
        />
      </div>
    </div>
  );
};

export default AdminCategoryList;
