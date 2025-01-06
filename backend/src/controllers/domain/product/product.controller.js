import {
  createProduct,
  searchProduct,
  listProducts,
  updateProduct,
  changeProductStatus,
  deleteProduct,
} from "@models/product/product.dao.js";

const productController = {
  create: async (new_product) => await createProduct(new_product),
  list: async (filter) => await listProducts(filter),
  search: async (search_params) => await searchProduct(search_params),
  update: async (product) => await updateProduct(product),
  changeStatus: async ({ id, estado_producto_id }) =>
    await changeProductStatus(id, estado_producto_id),
  delete: async (id) => await deleteProduct(id),
};

export { productController };
