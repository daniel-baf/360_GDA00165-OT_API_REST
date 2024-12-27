import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let db_instance = null;

// open function to get the connection, if it's not open yet then open it,
// follows the singleton pattern
function getConnection() {
  try {
    if (!db_instance) {
      db_instance = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
          host: process.env.DB_HOST, // Ejemplo: 'localhost' o '192.168.1.1'
          dialect: "mssql", // Esto indica que estamos usando MSSQL
          dialectOptions: {
            encrypt: true, // Se usa para conexiones seguras, ajusta según sea necesario
            trustServerCertificate: true, // Usado para evitar errores de certificado si no es necesario
          },
          define: {
            timestamps: false, // Desactiva los timestamps por defecto
          },
          // logging: false, // Desactiva los logs por defecto
        }
      );
    }
    return db_instance;
  } catch (error) {
    console.log("Error en la conexión a la base de datos: ", error);
    return null;
  }
}

function testConnection() {
  try {
    getConnection().authenticate();
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.log("Error en la conexión a la base de datos: ", error);
  }
}

export { getConnection, testConnection };
