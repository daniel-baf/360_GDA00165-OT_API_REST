import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaSave } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import {
  AdminCategoryCreateProps,
  schema,
  FormDataCategoryCreate,
} from "./AdminCategoryCreate.validations";

const AdminCategoryCreate: React.FC<AdminCategoryCreateProps> = ({
  id = undefined,
  nombre = "",
  descripcion = "",
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataCategoryCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      id,
      nombre,
      descripcion,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="p-4 bg-gray-800 shadow-md rounded-md"
    >
      <div className="mb-4">
        <label className="block text-gray-300">Código</label>
        <input
          type="text"
          placeholder="ID automatico"
          {...register("id")}
          disabled
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300"
        />
        {errors.id && (
          <p className="text-red-500 text-sm">{errors.id.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-300">Nombre</label>
        <input
          type="text"
          placeholder="ej. Chocolates"
          {...register("nombre")}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-300">Descripción</label>
        <textarea
          rows={5}
          {...register("descripcion")}
          placeholder="... descripcion del chocolate ...."
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300"
        />
        {errors.descripcion && (
          <p className="text-red-500 text-sm">{errors.descripcion.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {id ? <AiOutlineEdit className="mr-2" /> : <FaSave className="mr-2" />}
        {id ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

export default AdminCategoryCreate;
