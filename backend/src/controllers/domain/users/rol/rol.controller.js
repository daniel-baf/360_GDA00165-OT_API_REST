import {
  createRol,
  listRol,
  updateRol,
  deleteRol,
} from "@models/user/rol/rol.dao.js";

const rolController = {
  create: async (nombre, descripcion) =>
    await createRol({ nombre, descripcion }),

  list: async () => await listRol(),

  listLimitOffset: async (limit, offset = 0) => {
    if (!limit) throw new Error("Debes indicar el limite");
    offset = Number(offset);
    limit = Number(limit);
    return await listRol(limit, offset);
  },

  update: async (rol_update_data) => await updateRol(rol_update_data),

  delete: async (id) => await deleteRol(id),
};

export { rolController };
