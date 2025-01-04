/**
 * Function to block a user's access by setting their status to 'inhabilitado'.
 * This function retrieves the list of user statuses and finds the 'inhabilitado' status.
 * If the status is found, it updates the user's status to 'inhabilitado'.
 * @param {number} id - The ID of the user to block.
 * @returns {Promise<Object>} - A promise that resolves to the status object if found.
 * @throws {Error} - Throws an error if the 'inhabilitado' status is not found or if there is an error during the process.
 */
import { getConnection } from "@ORM/sequelize_orm.model.js";
import { hashData } from "@services/hashing/cypter.service.js";
import { listUserStatuses } from "../model_states/user_status.dao.js";

const sequelize = getConnection();

/**
 * Function to create a new user in the database.
 * This function calls the stored procedure p_create_usuario to insert a new user.
 * @param {Object} user - The user object containing user details.
 * @returns {Promise<Object>} - A promise that resolves to the result of the insertion.
 */
async function createUser(user) {
  try {
    user.password = await hashData(user.password);
    user.NIT = user.NIT?.toUpperCase() || "cf".toUpperCase();
  } catch (error) {
    throw new EvalError(
      "No se ha podido encriptar la contraseña para el nuevo usuario" +
        error.message
    );
  }

  const {
    email,
    nombre_completo,
    NIT = null,
    password,
    telefono = null,
    fecha_nacimiento,
    rol_id,
    estado_usuario_id,
  } = user;

  let db_user = null;

  try {
    // verify if  user exists
    db_user = await searchUser({ email });
  } catch (error) {
    // CONTINUE -> user does not exist
  }

  if (db_user) {
    throw new Error("El usuario ya existe");
  }

  try {
    let [result] = await sequelize.query(
      "EXEC p_create_usuario @email=:email, @nombre_completo=:nombre_completo, @NIT=:NIT, @password=:password, @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento, @rol_id=:rol_id, @estado_usuario_id=:estado_usuario_id",
      {
        replacements: {
          email,
          nombre_completo,
          NIT,
          password,
          telefono,
          fecha_nacimiento,
          rol_id,
          estado_usuario_id,
        },
        type: sequelize.QueryTypes.CREATE,
      }
    );

    return { id: result[0].id, ...user };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Function to update an existing user in the database.
 * This function calls the stored procedure `p_update_usuario` to update user details.
 *
 * Si recibe la contraseña, la encripta antes de actualizarla. asi que si no se quiere cambiar, no enviarla.
 * @param {number} id - The ID of the user to update.
 * @param {Object} user - The user object containing updated user details.
 * @returns {Promise<Object>} - A promise that resolves to the result of the update.
 */
async function updateUser(id, user) {
  const {
    email = null,
    nombre_completo = null,
    NIT = null,
    password = null,
    telefono = null,
    fecha_nacimiento = null,
    estado_usuario_id = null,
    rol_id = null,
  } = user;

  if (password) {
    password = await hashData(password);
  }

  const replacementes = {
    id,
    email,
    nombre_completo,
    NIT,
    password,
    telefono,
    fecha_nacimiento,
    estado_usuario_id,
    rol_id,
  };
  try {
    await sequelize.query(
      "EXEC p_update_usuario :id, :email, :nombre_completo, :NIT, :password, :telefono, :fecha_nacimiento, :estado_usuario_id, :rol_id",
      {
        replacements: replacementes,
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return Object.fromEntries(
      Object.entries({ id, ...replacementes }).filter(([key, value]) => !!value)
    );
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + error.message);
  }
}

/**
 * Function to block a user's access by setting their status to 'inhabilitado'.
 * This function retrieves the list of user statuses and finds the 'inhabilitado' status.
 * If the status is found, it updates the user's status to 'inhabilitado'.
 * @param {number} id - The ID of the user to block.
 * @returns {Promise<Object>} - A promise that resolves to the result of the update.
 * @throws {Error} - Throws an error if the 'inhabilitado' status is not found or if there is an error during the process.
 */
async function blockUserAccess(id) {
  return await changeUserAccess(id, "inhabilitado");
}

/**
 * Function to grant a user's access by setting their status to 'habilitado'.
 * This function retrieves the list of user statuses and finds the 'habilitado' status.
 * If the status is found, it updates the user's status to 'habilitado'.
 * @param {number} id - The ID of the user to grant access.
 * @returns {Promise<Object>} - A promise that resolves to the result of the update.
 * @throws {Error} - Throws an error if the 'habilitado' status is not found or if there is an error during the process.
 */
async function grantUserAccess(id) {
  return await changeUserAccess(id, "activado");
}

/**
 * Function to change a user's access status.
 * This function retrieves the list of user statuses and finds the specified status.
 * If the status is found, it updates the user's status to the specified status.
 * @param {number} id - The ID of the user to change access.
 * @param {string} statusName - The name of the status to set for the user.
 * @returns {Promise<Object>} - A promise that resolves to the result of the update.
 * @throws {Error} - Throws an error if the specified status is not found or if there is an error during the process.
 */
async function changeUserAccess(id, statusName) {
  try {
    let statuses = await listUserStatuses();
    let status = statuses.find(
      (status) => status.nombre === statusName.toUpperCase()
    );
    if (!status) {
      throw new Error(`Estado de usuario '${statusName}' no encontrado`);
    }
    return await updateUser(id, { estado_usuario_id: status.id });
  } catch (error) {
    throw new Error(`Error al cambiar el acceso del usuario: ${error.message}`);
  }
}

/**
 * Function to delete a user from the database.
 * This function calls the stored procedure `p_delete_usuario` to delete a user by ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<Object>} - A promise that resolves to the result of the deletion.
 */
async function deleteUser(id) {
  try {
    if (!id) throw new TypeError("Se requiere un id para eliminar el usuario");

    let [delete_status] = await sequelize.query("EXEC p_delete_usuario :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });
    return {
      id,
      mensaje: delete_status.mensaje,
    };
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
}

/**
 * Function to list users from the database with pagination.
 * This function calls the stored procedure `p_list_usuario` to list users.
 * @param {number} [limit] - The maximum number of users to return.
 * @param {number} [offset=0] - The number of users to skip before starting to return results.
 * @returns {Promise<Array>} - A promise that resolves to the list of users.
 */
async function listUsers(filters) {
  try {
    const { limit = null, offset = 0 } = filters;
    const users = await sequelize.query(
      "EXEC p_list_usuario @limit=:limit, @offset=:offset",
      {
        replacements: { limit, offset },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return users;
  } catch (error) {
    throw new Error("Error al listar los usuarios: " + error.message);
  }
}

/**
 * Function to search for a user in the database by ID or email.
 * This function calls the stored procedure `p_search_usuario` to search for a user.
 * @param {number} [id] - The ID of the user to search for.
 * @param {string} [email] - The email of the user to search for.
 * @returns {Promise<Object>} - A promise that resolves to the user details.
 */
async function searchUser({ id = null, email = null }) {
  const [user] = await sequelize.query(
    "EXEC p_search_usuario @id=:id, @email=:email",
    {
      replacements: { id, email },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
}

export {
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  searchUser,
  blockUserAccess,
  grantUserAccess,
};
