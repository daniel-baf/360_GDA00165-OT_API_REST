import {
  createRol,
  listRol,
  updateRol,
  deleteRol,
} from "@models/user/rol/rol.dao.js";

const rolController = {
  create: async (nombre, descripcion) =>
    await createRol({ nombre, descripcion }),

  list: async (filters) => await listRol(filters),
  update: async (rol_update_data) => await updateRol(rol_update_data),

  delete: async (id) => await deleteRol(id),
};

export { rolController };
