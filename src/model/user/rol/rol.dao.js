import { getConnection } from "@ORM/sequelize_orm.model.js";

const sequelize = getConnection();

/**
 * Create a new role using Sequelize
 * @param {string} nombre - The name of the role
 * @param {string} descripcion - The description of the role
 * @returns {Promise} - Promise object represents the result of the query
 */
const createRol = async (rol_data) => {
  try {
    let { nombre, descripcion } = rol_data;
    const [result] = await sequelize.query(
      "EXEC p_create_rol :nombre, :descripcion",
      {
        replacements: { nombre, descripcion },
        type: sequelize.QueryTypes.CREATE,
      }
    );

    return { id: result[0].id, ...rol_data };
  } catch (err) {
    throw new Error(
      "No se pudo crear el rol, es posible que ya exista un rol con el mismo nombre"
    );
  }
};

/**
 * Update an existing role using Sequelize
 * @param {number} id - The ID of the role
 * @param {string} nombre - The name of the role
 * @param {string} descripcion - The description of the role
 * @returns {Promise} - Promise object represents the result of the query
 */
const updateRol = async (rol_data) => {
  try {
    let { id } = rol_data;
    delete rol_data.id;
    rol_data = JSON.stringify(rol_data);
    console.log(rol_data);

    const result = await sequelize.query("EXEC p_update_rol :id, :json", {
      replacements: { id, json: rol_data },
      type: sequelize.QueryTypes.UPDATE,
    });
    return { id, ...JSON.parse(rol_data) };
  } catch (err) {
    throw new Error("Error al actualizar el rol " + err);
  }
};

/**
 * List all roles with pagination using Sequelize
 * @param {number} limit - The number of roles to return
 * @param {number} offset - The number of roles to skip
 * @returns {Promise} - Promise object represents the result of the query
 */
const listRol = async (limit = null, offset = 0) => {
  try {
    let result = await sequelize.query("EXEC p_list_rol :limit, :offset", {
      replacements: { limit, offset },
      type: sequelize.QueryTypes.SELECT,
    });

    return result;
  } catch (err) {
    throw new Error("Error listing roles with Sequelize: " + err);
  }
};

/**
 * Delete a role by ID using Sequelize
 * @param {number} id - The ID of the role
 * @returns {Promise} - Promise object represents the result of the query
 */
const deleteRol = async (id) => {
  try {
    const result = await sequelize.query("EXEC p_delete_rol :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });
    return { id };
  } catch (err) {
    throw new Error(
      "No se pudo eliminar el rol, es posible que no exista " + err
    );
  }
};

export { createRol, updateRol, listRol, deleteRol };
