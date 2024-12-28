import {
  createProductCategory,
  listProductsCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@models/product/product_category.dao.js";

const productCategoryController = {
  create: async ({ nombre, descripcion }) => {
    if (!nombre || !descripcion) throw new Error("Los campos son obligatorios");
    return await createProductCategory({ nombre, descripcion });
  },

  list: async () => await listProductsCategory(),

  listLimitOffset: async ({ limit, offset = 0 }) => {
    if (!limit || !offset) throw new Error("Los campos son obligatorios");
    return await listProductsCategory(limit, offset);
  },

  update: async (updates) => {
    if (!updates?.id) throw new Error("El id es un campo obligatorio");
    return await updateProductCategory(updates);
  },

  delete: async (id) => {
    if (!id) throw new Error("El id es un campo obligatorio");
    return await deleteProductCategory(id);
  },
};

export { productCategoryController };
