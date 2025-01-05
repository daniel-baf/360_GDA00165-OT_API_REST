import { getConnection } from "@ORM/sequelize_orm.model.js";

let connection = getConnection();

/**
 * Creates a new order in the database.
 *
 * @param {Object} order_insert - The order data to insert.
 * @param {number} order_insert.usuario_id - The ID of the user placing the order.
 * @param {number} order_insert.direccion_entrega_id - The ID of the delivery address.
 * @param {number} [order_insert.estado_pedido_id=1] - The status ID of the order, defaults to pending status.
 * @param {Object} order_insert.details - The details of the order.
 * @throws {Error} If any required field is missing or if there are no order details.
 * @returns {Promise<Object>} The created order with its ID and provided fields.
 */
async function createOrder(order_insert) {
  let pending_status = 1;

  let {
    usuario_id = null,
    direccion_entrega_id = null,
    estado_pedido_id = pending_status,
    details = {},
  } = order_insert;

  if (!usuario_id || !direccion_entrega_id || !estado_pedido_id || !details)
    throw new Error("todos los campos son obligatorios");

  if (Object.keys(details).length === 0)
    throw new Error("Debe haber al menos un detalle de pedido");

  try {
    let [result] = await connection.query(
      `EXEC p_create_pedido :usuario_id, :direccion_entrega_id, :estado_pedido_id, :json_detalles`,
      {
        replacements: {
          usuario_id,
          direccion_entrega_id,
          estado_pedido_id,
          json_detalles: JSON.stringify(details),
        },
        type: connection.QueryTypes.INSERT,
      }
    );

    return Object.fromEntries(
      Object.entries({
        id: result[0].id,
        usuario_id,
        direccion_entrega_id,
        estado_pedido_id,
      }).filter(([_, v]) => v)
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Lists orders based on provided filters and user permissions.
 *
 * @param {Object} filters - The filters to apply to the order listing.
 * @param {number|null} [filters.limit=null] - The maximum number of orders to return. Must be at least 1 or null.
 * @param {number} [filters.offset=0] - The number of orders to skip before starting to collect the result set.
 * @param {boolean} [filters.detailed=false] - Whether to include detailed information for each order.
 * @param {number|null} [filters.target_user=null] - The ID of the user whose orders to list. If null, lists orders for all users.
 * @param {number|null} [filters.target_state=null] - The state of the orders to list. If null, lists orders of all states.
 * @param {Object} user - The user making the request.
 * @param {number} user.rol_id - The role ID of the user.
 * @param {number} user.id - The ID of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of orders.
 * @throws {Error} If the limit is less than 1 or if the user does not have permission to access the requested data.
 */
async function listOrders(filters, user) {
  let {
    limit = null,
    offset = 0,
    detailed = false,
    target_user = null,
    target_state = null,
  } = filters;

  if (!!limit && limit < 1)
    throw new Error("El limite debe ser de al menos 1 o null");
  if (detailed && (limit === null || limit > 100)) {
    limit = 100;
  }

  try {
    // verify the one requesting non filtered orders is an admin
    if (!target_user && user.rol_id !== 2 && user.id !== target_user) {
      throw new Error(
        "No tienes permisos para acceder a estos datos, solo puedes acceder a tus propios datos"
      );
    }

    // recover the orders
    let orders = await connection.query(
      `EXEC p_list_pedido :limit, :offset, :target_state, :target_user`,
      {
        replacements: { limit, offset, target_user, target_state },
        type: connection.QueryTypes.SELECT,
      }
    );

    // if detailed false, end the function
    if (!detailed) return orders;
    // if detailed true, recover the order details

    await Promise.all(
      orders.map(async (order) => {
        let order_details = await connection.query(
          `EXEC p_list_detalles_pedido :id_pedido`,
          {
            replacements: { id_pedido: order.id },
            type: connection.QueryTypes.SELECT,
          }
        );
        order.details = order_details;
      })
    );

    return orders;
  } catch (error) {
    throw error;
  }
}

/**
 * Lists orders with optional detailed information.
 *
 * @param {boolean} [detailed=false] - Whether to include detailed information for each order.
 * @param {number|null} [limit=null] - The maximum number of orders to retrieve. Must be at least 1 or null.
 * @param {number} [offset=0] - The number of orders to skip before starting to collect the result set.
 * @returns {Promise<Array>} A promise that resolves to an array of orders. If detailed is true, each order will include its details.
 * @throws {Error} If the limit is less than 1.
 */
async function searchOrder({ id, detailed = false }) {
  try {
    if (!id) throw new Error("El id es obligatorio para buscar ");

    let [order] = await connection.query(`EXEC p_search_pedido :id`, {
      replacements: { id: id },
      type: connection.QueryTypes.SELECT,
    });

    if (!order) throw new Error("El pedido no existe");

    if (detailed) {
      let order_details = await connection.query(
        `EXEC p_list_detalles_pedido :id_pedido`,
        {
          replacements: { id_pedido: id },
          type: connection.QueryTypes.SELECT,
        }
      );
      order.details = order_details;
    }

    return order;
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes an order from the database.
 *
 * @async
 * @function deleteOrder
 * @param {Object} params - The parameters for deleting the order.
 * @param {number} params.id - The ID of the order to delete.
 * @param {Object} params.user - The user attempting to delete the order.
 * @param {number} params.user.id - The ID of the user.
 * @param {number} params.user.rol_id - The role ID of the user.
 * @throws {Error} If the order ID is not provided.
 * @throws {Error} If the user does not have permission to delete the order.
 * @returns {Promise<Object>} The result of the delete operation.
 */
async function deleteOrder({ id, user }) {
  try {
    if (!id) throw new Error("El id es obligatorio");

    let order_db = await searchOrder({ id });

    if (user.rol_id !== 2 && user.id !== order_db.usuario_id)
      throw new Error("No tienes permisos para realizar esta acción");

    let [result] = await connection.query(`EXEC p_delete_pedido :id`, {
      replacements: { id },
      type: connection.QueryTypes.DELETE,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Changes the state of an order in the database.
 *
 * @param {number} pedido_id - The ID of the order to update.
 * @param {number} nuevo_estado_id - The new state ID to set for the order.
 * @throws {Error} If any required field is missing.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function changeOrderState(pedido_id, nuevo_estado_id) {
  if (!pedido_id || !nuevo_estado_id)
    throw new Error("todos los campos son obligatorios");

  try {
    let result = await connection.query(
      `EXEC p_cambiar_estado_pedido :pedido_id, :nuevo_estado_id`,
      {
        replacements: { pedido_id, nuevo_estado_id },
        type: connection.QueryTypes.UPDATE,
      }
    );

    return {
      pedido_id,
      nuevo_estado_id,
      message: "Se ha cambiaado el estado",
    };
  } catch (error) {
    throw error;
  }
}

export { createOrder, listOrders, searchOrder, deleteOrder, changeOrderState };
