import { getConnection } from "@ORM/sequelize_orm.model.js";
import { DataTypes } from "sequelize";

const sequelize = getConnection();

const UserStatus = sequelize.define("estado_usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(245),
    allowNull: true,
  },
});

const OrderStatus = sequelize.define("estado_pedido", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(245),
    allowNull: true,
  },
});

export { UserStatus, OrderStatus };
