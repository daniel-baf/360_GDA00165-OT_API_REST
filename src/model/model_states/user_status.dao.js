import { UserStatus } from "./model_status.js";
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
        type: connection.QueryTypes.SELECT,
      }
    );
    console.log(result);

    return { id: result.id, ...{ nombre, descripcion } };
  } catch (error) {
    throw new Error("Error creating user status: " + error.message);
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
        type: connection.QueryTypes.SELECT,
      }
    );
    return { message: `Estado de usuario con id ${id} actualizado` };
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
async function listUserStatuses(limit = null, offset = 0) {
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
        type: connection.QueryTypes.SELECT,
      }
    );
    return { message: `Estado de usuario con id ${id} borrado exitosamente` };
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
