import {
  createUserStatus,
  updateUserStatus,
  listUserStatuses,
  deleteUserStatus,
} from "@models/model_states/user_status.dao.js";

const user_status_controller = {
  create: async (new_user_status) => await createUserSCtrl(new_user_status),
  list: async () => listUserStatuses(),
  listLimitOffset: async ({ limit, offset }) => listUserStatuses(limit, offset),
  update: async (id, { nombre, descripcion }) =>
    updateUserStatus(id, nombre, descripcion),
  delete: async (id) => deleteUserStatus(id),
};

/**
 * Creates a new user status.
 *
 * @param {Object} params - The parameters for creating a user status.
 * @param {string} params.nombre - The name of the user status.
 * @param {string} params.descripcion - The description of the user status.
 * @throws {Error} Throws an error if 'nombre' or 'descripcion' is not provided.
 * @returns {Promise<Object>} The created user status.
 */
async function createUserSCtrl({ nombre, descripcion }) {
  if (!nombre || !descripcion) {
    throw new Error("Nombre y descripción son requeridos.");
  }
  return await createUserStatus(nombre, descripcion);
}

export { user_status_controller };
