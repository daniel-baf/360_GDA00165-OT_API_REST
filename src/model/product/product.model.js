import { getConnection } from "@ORM/sequelize_orm.model.js";
import { DataTypes } from "sequelize";

const sequelize = getConnection();

/**
 * Define model for product based on the schema GDA00165... table "gategoria_producto"
 */
const CategoriaProducto = sequelize.define(
  "categoria_producto",
  {
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
  },
  {
    tableName: "categoria_producto",
  }
);

/**
 * Define model for product based on the schema GDA00165... table "estado_producto"
 */
const EstadoProducto = sequelize.define(
  "estado_producto",
  {
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
  },
  {
    tableName: "estado_producto",
  }
);

/**
 * Define model for product based on the schema GDA00165... table "producto"
 */
const Producto = sequelize.define(
  "producto",
  {
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const value = this.getDataValue("precio");
        return value ? parseFloat(value) : null;
      },
    },
    precio_mayorista: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        const value = this.getDataValue("precio_mayorista");
        return value ? parseFloat(value) : null;
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: EstadoProducto,
        key: "id",
      },
    },
    categoria_producto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CategoriaProducto,
        key: "id",
      },
    },
  },
  {
    tableName: "producto",
  }
);

export { CategoriaProducto, EstadoProducto, Producto };
