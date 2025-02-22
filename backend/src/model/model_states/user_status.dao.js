import { getConnection } from "@ORM/sequelize_orm.model.js";

/**
 *
 * @param {string} nombre
 * @param {string} descripcion
 * @returns
 */
async function createUserStatus(nombre, descripcion) {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(
      "EXEC p_create_estado_usuario @nombre = :nombre, @descripcion = :descripcion",
      {
        replacements: { nombre, descripcion },
        type: connection.QueryTypes.CREATE,
      }
    );

    return { id: result[0].id, ...{ nombre, descripcion } };
  } catch (error) {
    throw new Error("Es posible que ya exista un valor con esta clave: " + error.message)
  }
}

/**
 *
 * @param {number} id
 * @param {string} nombre
 * @param {string} descripcion
 * @returns
 */
async function updateUserStatus(id, nombre = null, descripcion = null) {
  const connection = await getConnection();
  try {
    const result = await connection.query(
      "EXEC p_update_estado_usuario @id = :id, @nombre = :nombre, @descripcion = :descripcion",
      {
        replacements: { id, nombre, descripcion },
        type: connection.QueryTypes.UPDATE,
      }
    );

    return Object.fromEntries(
      Object.entries({ id, nombre, descripcion }).filter(([, value]) => !!value)
    );
  } catch (error) {
    throw new Error("Error updating user status: " + error.message);
  }
}

/**
 *
 * @param {number} limit
 * @param {number} offset
 * @returns
 */
async function listUserStatuses(filters) {
  let { limit = null, offset = 0 } = filters;
  const connection = await getConnection();
  try {
    const result = await connection.query(
      "EXEC p_list_estado_usuario @limit = :limit, @offset = :offset",
      {
        replacements: {
          limit,
          offset,
        },
        type: connection.QueryTypes.SELECT,
      }
    );
    return result;
  } catch (error) {
    throw new Error("Error listing user statuses: " + error.message);
  }
}

/**
 *
 * @param {number} id
 * @returns
 */
async function deleteUserStatus(id) {
  const connection = await getConnection();
  try {
    const result = await connection.query(
      "EXEC p_delete_estado_usuario @id = :id",
      {
        replacements: { id },
        type: connection.QueryTypes.DELETE,
      }
    );
    return { id };
  } catch (error) {
    throw new Error("Error deleting user status: " + error.message);
  }
}

export {
  createUserStatus,
  updateUserStatus,
  listUserStatuses,
  deleteUserStatus,
};
