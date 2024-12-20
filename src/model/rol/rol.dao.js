import { getConnection } from "@ORM/sequelize_orm.model.js";
import { DataTypes, json } from "sequelize";

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
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return { id: result.id, ...rol_data };
  } catch (err) {
    console.error("Error creating role with Sequelize:", err);
    throw err;
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
    console.error("Error updating role with Sequelize:", err);
    throw err;
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
    console.error("Error listing roles with Sequelize:", err);
    throw err;
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
    return { message: `Rol con ID ${id} eliminado` };
  } catch (err) {
    console.error("Error deleting role with Sequelize:", err);
    throw err;
  }
};

export { createRol, updateRol, listRol, deleteRol };
