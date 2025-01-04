import { getConnection } from "@ORM/sequelize_orm.model.js";

let connection = getConnection();

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
async function searchOrder(id, detailed = false) {
  try {
    if (!id) throw new Error("El id es obligatorio");

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

async function deleteOrder({ id, user }) {
  try {
    if (!id) throw new Error("El id es obligatorio");

    let order_db = await searchOrder(id);

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

export { createOrder, listOrders, searchOrder, deleteOrder };
