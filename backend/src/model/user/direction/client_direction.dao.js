import { getConnection } from "@ORM/sequelize_orm.model.js";

const sequelize = getConnection();

/**
 * Create a new client direction
 * @param {Object} direction - The direction data
 * @param {string} direction.departamento - The department
 * @param {string} direction.municipio - The municipality
 * @param {string} direction.direccion - The address
 * @param {string} direction.telefono - The phone number
 * @param {number} direction.usuario_id - The user ID
 * @returns {Promise<Object>} The result of the stored procedure
 */
async function createDirection(new_data_direction) {
  const {
    departamento = null,
    municipio = null,
    direccion = null,
    telefono = null,
    usuario_id = null,
  } = new_data_direction;

  if (!departamento || !municipio || !direccion || !usuario_id) {
    throw new Error("Todos los campos menos el telefono, son requeridos");
  }

  let replacements = {
    departamento,
    municipio,
    direccion,
    telefono,
    usuario_id,
  };

  const [result] = await sequelize.query(
    `EXEC p_create_direccion_cliente @departamento=:departamento, @municipio=:municipio, @direccion=:direccion, @telefono=:telefono, @usuario_id=:usuario_id`,
    {
      replacements,
      type: sequelize.QueryTypes.CREATE,
    }
  );

  return { id: result[0].id, ...replacements };
}

/**
 * Update an existing client direction
 * @param {Object} direction - The direction data
 * @param {number} direction.id - The direction ID
 * @param {string} [direction.departamento] - The department
 * @param {string} [direction.municipio] - The municipality
 * @param {string} [direction.direccion] - The address
 * @param {string} [direction.telefono] - The phone number
 * @returns {Promise<void>}
 */
async function updateDirection(direction_update) {
  const {
    id,
    departamento = null,
    municipio = null,
    direccion = null,
    telefono = null,
  } = direction_update;

  let direction = { id, departamento, municipio, direccion, telefono };

  if (!id) {
    throw new Error("ID es requerido");
  }

  if (!departamento && !municipio && !direccion && !telefono) {
    throw new Error("Al menos un campo debe ser proporcionado para actualizar");
  }

  await sequelize.query(
    `EXEC p_update_direccion_cliente @id=:id, @departamento=:departamento, @municipio=:municipio, @direccion=:direccion, @telefono=:telefono`,
    {
      replacements: direction,
      type: sequelize.QueryTypes.UPDATE,
    }
  );

  return Object.fromEntries(Object.entries(direction).filter(([_, v]) => v));
}

/**
 * Delete a client direction
 * @param {number} id - The direction ID
 * @returns {Promise<void>}
 */
async function deleteDirection(id) {
  if (!id) {
    throw new Error("ID necesario para borrar la direccion");
  }

  await sequelize.query(`EXEC p_delete_direccion_cliente @id=:id`, {
    replacements: { id },
    type: sequelize.QueryTypes.DELETE,
  });

  return { id: id };
}

/**
 * List client directions, if usuario_id is provided, it will list the directions of that user
 * otherwise it will list all directions
 * @param {Object} [filter] - The filter criteria
 * @param {number} [filter.usuario_id] - The user ID
 * @param {number} [filter.id] - The direction ID
 * @returns {Promise<Array>} The list of directions
 */
async function listDirections(usuario_id = null) {
  const results = await sequelize.query(
    `EXEC p_list_direccion_cliente :usuario_id`,
    {
      replacements: { usuario_id },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return results;
}

export { createDirection, updateDirection, deleteDirection, listDirections };
