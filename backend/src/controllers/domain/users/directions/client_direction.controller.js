import {
  createDirection,
  updateDirection,
  deleteDirection,
  listDirections,
  searchDirection,
} from "@models/user/direction/client_direction.dao.js";

const client_direction_controller = {
  // only admins are allowed to send the usuario_id, otherwise take the logged user id
  create: async (new_direction, logged_user) =>
    await createDirectionController(new_direction, logged_user),

  list: async (filters, user) => await listDirections(filters, user),
  update: async (direction, logged_user) =>
    await updateDirectionController(direction, logged_user),

  delete: async (direction_id, logged_user) =>
    deleteDirectionController(direction_id, logged_user),
};

/**
 * Check if the logged user has the appropriate permissions to operate on the direction.
 * @param {number} direction_id
 * @param {object} logged_user
 */
async function verifyOwnership(direction_id, logged_user) {
  if (logged_user?.rol_id === 2) return;

  if (!direction_id || !logged_user) {
    throw new Error(
      "La dirección que intentas actualizar no existe o no tiene un usuario asociado."
    );
  }

  // check if user is trying to update a direction that is not his
  let db_direction = await searchDirection(direction_id);

  if (db_direction.usuario_id !== logged_user.id) {
    throw new Error("No tienes permiso para actualizar esta dirección.");
  }
}

async function deleteDirectionController(direction_id, logged_user) {
  // check if user is trying to update a direction that is not his
  await verifyOwnership(direction_id, logged_user);
  return await deleteDirection(direction_id);
}

/**
 * Updates a direction if the logged user has the appropriate permissions.
 *
 * @param {Object} direction - The direction object to be updated.
 * @param {Object} logged_user - The user object of the logged-in user.
 * @param {number} logged_user.rol_id - The role ID of the logged-in user.
 * @param {number} logged_user.id - The ID of the logged-in user.
 * @returns {Promise<Object>} The updated direction object.
 * @throws {Error} If the logged-in user does not have permission to update the direction.
 */
async function updateDirectionController(direction, logged_user) {
  // check if user is trying to update a direction that is not his
  await verifyOwnership(direction.id, logged_user);
  return await updateDirection(direction);
}

/**
 * Create a new direction, checks for seesion JWT id user and use it in the
 * direction creation. if the user is an admin, the direction is created for the
 * @param {object} new_direction
 * @param {object} logged_user
 * @returns
 */
async function createDirectionController(new_direction, logged_user) {
  // recover the logged user from the request
  if (logged_user?.rol_id !== 2) {
    // the user is not an admin -> the direction is for the logged user
    new_direction.usuario_id = logged_user.id;
  }
  if (logged_user?.rol_id === 2 && !new_direction.usuario_id)
    throw new Error(
      "El administrador debe especificar el usuario al que pertenece la dirección."
    );

  return await createDirection(new_direction);
}

async function listByUserController(user_id, logged_user) {
  if (!user_id) {
    throw new Error("ID de usuario necesario para listar las direcciones.");
  }

  let directions = await listDirections(user_id);
  // admin request?
  if (logged_user?.rol_id === 2) {
    return directions;
  }
  // Check if the requested directions are owned by the user.
  if (logged_user?.id !== directions[0]?.usuario_id) {
    throw new Error("No tienes permiso para acceder a estas direcciones.");
  }
  return directions;
}

export { client_direction_controller };
