import { getConnection } from "@ORM/sequelize_orm.model.js";
import { DataTypes } from "sequelize";

const sequelize = getConnection();

const Rol = sequelize.define('rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(245),
        allowNull: true
    }
}, {
    tableName: 'rol',
    timestamps: false
});

export default Rol;