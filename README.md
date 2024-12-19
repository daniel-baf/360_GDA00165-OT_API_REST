# Proyecto API-REST con Node.js, Express y SQL Server

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de un API-REST utilizando **Node.js** (v22.12.0), **Express**, y **SQL Server** como base de datos. El objetivo principal es implementar las funcionalidades necesarias para el manejo de productos, categorías, estados, usuarios, órdenes y clientes, cumpliendo con los requerimientos establecidos en el "Reto Segunda Semana".

El proyecto incluye:

- CRUD de diferentes entidades.
- Implementación de seguridad mediante **JSON Web Tokens (JWT)**.
- Gestión de sesiones y validación de transacciones.
- Validación y prueba de los endpoints con **Postman**.
- Publicación del código en un repositorio de **GitHub**.
- Script SQL para la base de datos con registros de prueba.

### Clave de Usuario para el Concurso

- **Clave de aspirante**: GDA00165-OT
- **Grupo de clase**: A

---

## Requisitos Previos

- **Node.js** v22.12.0
- **npm** 11.0.0
- **SQL Server**
- **Postman** para pruebas de endpoints
- Repositorio en **GitHub**

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno en un archivo `.env`:
   ```env
   DB_HOST=<TU_HOST>
   DB_USER=<TU_USUARIO>
   DB_PASSWORD=<TU_CONTRASEÑA>
   DB_NAME=<NOMBRE_DE_LA_BASE_DE_DATOS>
   JWT_SECRET=<TU_SECRETO_JWT>
   ```

4. Ejecutar el servidor:
   ```bash
   npm start
   ```

5. Probar los endpoints utilizando Postman.

---

## Dependencias

El proyecto utiliza las siguientes dependencias principales:

- **express**: Framework web para construir la API.
- **jsonwebtoken**: Para la autenticación mediante JWT.
- **bcryptjs**: Para el hash de contraseñas.
- **mssql**: Conector para interactuar con SQL Server.
- **dotenv**: Para la gestión de variables de entorno.

Instalar todas las dependencias usando:
```bash
npm install express jsonwebtoken bcryptjs mssql dotenv
```

---

## Funcionalidad

### Endpoints CRUD

1. **Productos**
   - Crear, actualizar, eliminar y listar productos.

2. **Categorías de Productos**
   - CRUD completo para las categorías.

3. **Estados**
   - Gestión de estados de productos o pedidos.

4. **Usuarios**
   - CRUD con encriptación de contraseñas.

5. **Orden y Detalles**
   - CRUD maestro-detalle para la gestión de órdenes y sus detalles.

6. **Clientes**
   - Gestión completa de los datos de clientes.

---

### Seguridad

1. **Autenticación con JWT**
   - Generación de tokens al iniciar sesión.
   - Validación de cada solicitud con un token válido.
   - Expiración de tokens en 24 horas.

2. **Gestión de Sesiones**
   - Control de inicio y cierre de sesión para los usuarios.

---

## Pruebas

- Utilizar **Postman** para probar cada uno de los endpoints.
- Validar que las operaciones CRUD y la autenticación funcionen correctamente.
- Verificar el manejo de errores y las respuestas del servidor.

---

## Publicación y Scripts

- Subir el proyecto a un repositorio público en **GitHub**.
- Adjuntar el script SQL de la base de datos con datos de prueba.

---

Si tienes alguna duda o sugerencia sobre este proyecto, ¡no dudes en comunicarte! 😊