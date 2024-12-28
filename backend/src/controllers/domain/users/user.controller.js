import {
  listUsers,
  createUser,
  deleteUser,
  updateUser,
  searchUser,
  blockUserAccess,
  grantUserAccess,
} from "@models/user/user.dao.js";

/**
 * User Controller
 *
 * Provides methods to manage users including creating, listing, searching, updating, blocking, unlocking, and deleting users.
 */
const userController = {
  /**
   * Creates a new user.
   * @param {Object} new_user - The user object to create.
   * @returns {Promise<Object>} The created user object.
   */
  create: async (new_user) => await createUser(new_user),

  /**
   * Lists all users.
   * @returns {Promise<Array>} An array of user objects.
   */
  list: async () => await listUsers(),

  /**
   * Lists users with pagination.
   * @param {number} limit - The maximum number of users to return.
   * @param {number} offset - The number of users to skip before starting to collect the result set.
   * @returns {Promise<Array>} An array of user objects.
   */
  listLimitOffset: async (limit, offset) => {
    limit = parseInt(limit) || null;
    offset = parseInt(offset) || 0;
    return await listUsers(limit, offset);
  },

  /**
   * Searches for a user by ID or email.
   * @param {Object} search_params - The search parameters.
   * @param {string} [search_params.id] - The ID of the user to search for.
   * @param {string} [search_params.email] - The email of the user to search for.
   * @throws {Error} If neither ID nor email is provided.
   * @returns {Promise<Object>} The found user object.
   */
  search: async ({ id, email }) => {
    if (!id && !email) {
      throw new Error("Se requiere al menos un parametro para buscar");
    }
    return await searchUser(id, email);
  },

  /**
   * Updates a user.
   * @param {string} id - The ID of the user to update.
   * @param {Object} data_update - The data to update the user with.
   * @returns {Promise<Object>} The updated user object.
   */
  update: async (id, data_update) =>
    await updateUserController(id, data_update),

  /**
   * Blocks a user's access.
   * @param {string} id - The ID of the user to block.
   * @returns {Promise<void>}
   */
  block: async (id) => await blockUserAccessController(id),

  /**
   * Unlocks a user's access.
   * @param {string} id - The ID of the user to unlock.
   * @returns {Promise<void>}
   */
  unlock: async (id) => await unlockUserAccessController(id),

  /**
   * Deletes a user.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>}
   */
  delete: async (id) => await deleteUser(id),
};

/**
 * Updates data into the form, invoques the function
 * and validates the date of birth in case sended as a stirng, 'cause function requieres a Date object
 * @param {number} id
 * @param {object} update_data
 * @returns
 */
async function updateUserController(id, update_data) {
  // try to cast date if it is a
  if (!!update_data.fecha_nacimiento) {
    try {
      update_data.fecha_nacimiento = new Date(update_data.fecha_nacimiento);
      // check if the date is valid
      if (isNaN(update_data.fecha_nacimiento.getTime())) {
        throw new Error("Fecha de nacimiento invalida");
      }
    } catch (error) {
      throw new Error(
        "Error al intentar convertir la fecha de nacimiento " + error.message
      );
    }
  }

  let updated_user = await updateUser(id, update_data);
  if (!updated_user) {
    throw new Error("Usuario no encontrado");
  }
  return updated_user;
}

/**
 * Controller function to block user access.
 *
 * @async
 * @function blockUserAccessController
 * @param {string} id - The ID of the user to block.
 * @throws {Error} Throws an error if the ID parameter is not provided.
 * @returns {Promise<void>} A promise that resolves when the user access is blocked.
 */
async function blockUserAccessController(id) {
  if (!id) {
    throw new Error("Se requiere al menos un parametro para inhabilitar");
  }
  return await blockUserAccess(id);
}

/**
 * Unlocks user access by granting access to the user with the specified ID.
 *
 * @async
 * @function unlockUserAccessController
 * @param {string} id - The ID of the user whose access is to be unlocked.
 * @throws {Error} Throws an error if the ID parameter is not provided.
 * @returns {Promise<void>} A promise that resolves when the user's access has been granted.
 */
async function unlockUserAccessController(id) {
  if (!id) {
    throw new Error("Se requiere al menos un parametro para desbloquear");
  }
  return await grantUserAccess(id);
}

export { userController };
