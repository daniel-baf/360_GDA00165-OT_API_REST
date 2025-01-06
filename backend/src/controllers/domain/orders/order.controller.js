import { searchDirection } from "@models/user/direction/client_direction.dao.js";
import { searchProduct } from "@models/product/product.dao.js";
import {
  listOrders,
  searchOrder,
  createOrder,
  deleteOrder,
  changeOrderState,
  updateOrder,
} from "@models/oders/order.dao.js";

const orderController = {
  listAll: async (filters, user) => await listOrders(filters, user),

  search: async (id, detailed = false, user) =>
    await searchOrderByOwner(user, { id, detailed }),

  create: async (form_data) => await createOrder(form_data),

  swapState: async ({ id, status }) => await changeOrderState(id, status),

  delete: async (params) => await deleteOrder(params),

  update: async (form_data) => await updateOrderAndValidate(form_data),
};

/**
 * Searches for the order and check if the user requesting it, is the owner of it
 * if the user is an admin, it will skip the check
 * @param {object} user
 * @param {object} filter_parameters id, detailed
 * @returns
 */
async function searchOrderByOwner(user, filter_parameters) {
  // disable detailed information 'cause the conversion reutnrs always a detailed one
  // search the order
  const order_db = await searchOrder(filter_parameters);

  const productos = filter_parameters.detailed
    ? await Promise.all(
        order_db.details?.map(async (product) => {
          const product_db = await searchProduct({ id: product.id });
          return { product: product_db[0], quantity: product.cantidad };
        })
      )
    : [];
  const direccion = await searchDirection(order_db.direccion_entrega_id);

  // check if the user is the owner of the order
  if (user.rol_id != 2 && user.id !== order_db.usuario_id) {
    throw new Error(
      "No tienes permisos para acceder a estos datos, solo puedes acceder a tus propios datos"
    );
  }

  return { direccion, productos };
}

async function updateOrderAndValidate({ id, products }) {
  if (!id || products.length === 0) {
    throw new Error(
      "No puedes actualizar el producto y dejarlo vacio, borralo en su lugar"
    );
  }

  // cast data to valid function format
  const casted_products = products.map((product) => ({
    cantidad: product.quantity,
    producto_id: product.product.id,
    precio_venta:
      product.quantity >= 12
        ? product.product.precio_mayorista
        : product.product.precio,
  }));

  return await updateOrder(id, casted_products);
}

export default orderController;
