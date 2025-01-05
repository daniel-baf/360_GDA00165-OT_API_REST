-- #########################################################################
-- CLAVE DE usuario: GDA00165-OT
-- DANIEL EDUARDO BAUTISTA FUENTES
--                      ** IMPORTANTE LEER ANTES DE EJECUTAR **
-- SE HA COLOCADO USE master; SOLAMENTE PARA PODER EJECUTAR EL DROP DE LA BD,
-- HE TRABAJADO EN LINUX, Y MI MSSQL ESTA CONFIGURADO CASE_SENSITIVE
-- LAS VISTAS NO ORDENAN LOS DATOS, UNA VISTA SOLO SIRVE PARA CONSUMIR DATOS, NO FILTRARLOS
-- https://dba.stackexchange.com/questions/4007/what-are-the-alternatives-for-an-order-by-clause-in-a-view
-- #########################################################################

-- RESUMEN
-- LOS PROCEDIMIENTOS SOLICITADOS SE LLAMAN p_cambiar_estado_producto y  p_create_usuario
-- Las vistas se llaman v_productos_activos_stock_m0, v_total_ingresos_agosto_pedidos v_mayores_clientes
-- Al principio de tu script o procedimiento almacenado
USE master;
GO
-- Eliminar la base de datos si existe y usuario por defecto
DROP DATABASE IF EXISTS [GDA00165_GT_DANIEL_BAUTISTA];

IF EXISTS (SELECT *
FROM sys.server_principals
WHERE name = 'GDA00165_GT')
BEGIN
    DROP LOGIN [GDA00165_GT];

END;

GO
-- Create the login with a password
CREATE LOGIN [GDA00165_GT] WITH PASSWORD = 'Contrase@nalg_dag123as511';
GO

-- Crear la base de datos dinámicamente
CREATE DATABASE [GDA00165_GT_DANIEL_BAUTISTA];
-- Usar la base de datos dinámicamente
GO
USE [GDA00165_GT_DANIEL_BAUTISTA];
GO

-- Delete the user if it exists in the current database
IF EXISTS (SELECT *
FROM sys.database_principals
WHERE name = 'GDA00165_GT_USER')
BEGIN
    DROP USER [GDA00165_GT_USER];

END;
GO

-- Create the user for the login in the current database
CREATE USER [GDA00165_GT_USER] FOR LOGIN [GDA00165_GT];
GO

-- Add the user to the db_owner role
ALTER ROLE db_owner ADD MEMBER [GDA00165_GT_USER];
GO

-- TABLA USADA PARA ALMACENAR LOS ROLES DE LOS usuarioS Y DAR ACCESO A DISTINTAS VISTAS
DROP TABLE IF EXISTS rol;

CREATE TABLE rol (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
);

-- ESTA TABLA SIRVE PARA INHABILITAR usuarioS Y NO DARLE ACCESO... A FUTURO PODRIA USARSE PARA MAS TIPOS DE ESTADOS
DROP TABLE IF EXISTS estado_usuario;

CREATE TABLE estado_usuario (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
);

-- TABLA USADA PARA ALMACENAR LOS ESTADOS DE LOS pedidoS, ENTREGADA...
DROP TABLE IF EXISTS estado_pedido;

CREATE TABLE estado_pedido (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
);

-- ALMACENA A TODOS LOS usuarioS DLE SISTEMA, TANTO OPERARIOS COMO CONSUMIDORES
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
    id INT PRIMARY KEY IDENTITY,
    email VARCHAR(50) NOT NULL UNIQUE,
    nombre_completo VARCHAR(50) NOT NULL,
    NIT VARCHAR(15) NOT NULL DEFAULT 'CF',
    password VARCHAR(75) NOT NULL,
    telefono VARCHAR(10),
    fecha_nacimiento DATE NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE (),
    rol_id INT FOREIGN KEY REFERENCES Rol (id),
    estado_usuario_id INT FOREIGN KEY REFERENCES estado_usuario (id),
);

-- UNA PERSONA PUEDE TENER VARIAS DIRECCIONES DE ENTREGA O NINGUNA, POR ESTO ES RELACION 1:0...*
-- SE DEBE VALIDAR QUE LAS DIRECCIONES DE ENTREGA SE ALMACENEN UNICAMENTE PARA LOS DEL ROL CLIENTE
DROP TABLE IF EXISTS direccion_cliente;

CREATE TABLE direccion_cliente (
    id INT PRIMARY KEY IDENTITY,
    departamento VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(10),
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);

-- TABLA USADA PARA CATEGORIZAR LOS productoS Y FACILITAR LA BUSQUEDA
DROP TABLE IF EXISTS categoria_producto;

CREATE TABLE categoria_producto (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
);

-- TABLA DE ESTADOS DE productoS, HABILITADO O DESHABILITADO...
DROP TABLE IF EXISTS estado_producto;

CREATE TABLE estado_producto (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
);

-- TABLA USADA PARA ALMACENAR LOS productoS QUE SE VENDEN
DROP TABLE IF EXISTS producto;

CREATE TABLE producto (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(245),
    precio DECIMAL(10, 2) NOT NULL,
    precio_mayorista DECIMAL(10, 2),
    stock INT NOT NULL,
    estado_producto_id INT FOREIGN KEY REFERENCES estado_producto (id) NOT NULL DEFAULT 1,
    -- por defecto el producto nuevo se habilitara
    categoria_producto_id INT FOREIGN KEY REFERENCES categoria_producto (id),
);

-- TABLA USADA PARA SERVIR COMO CONTENIDO DE UN pedido Y factura
DROP TABLE IF EXISTS detalle_pedido;

DROP TABLE IF EXISTS pedido;

CREATE TABLE pedido (
    id INT PRIMARY KEY IDENTITY,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE (),
    fecha_confirmacion DATE DEFAULT NULL,
    fecha_entrega DATE DEFAULT NULL,
    total DECIMAL(10, 2) NOT NULL,
    usuario_validador_id INT FOREIGN KEY REFERENCES usuario (id) DEFAULT NULL,
    -- PERSONA QUE DIO COMO VALIDO EL pedido
    usuario_id INT FOREIGN KEY REFERENCES usuario (id) NOT NULL,
    direccion_entrega_id INT FOREIGN KEY REFERENCES direccion_cliente (id) NOT NULL,
    estado_pedido_id INT FOREIGN KEY REFERENCES estado_pedido (id) NOT NULL DEFAULT 1,
);

-- TABLA USADA PARA ALMACENAR EL CONTENIDO DE UN pedido
CREATE TABLE detalle_pedido (
    id INT PRIMARY KEY IDENTITY,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    -- EL SUBTOTAL NO LO ALMACENO PORQUE SE PUEDE CALCULAR CON CANTIDAD * PRECIO_VENTA, ES UN ATRIBUTO DERIVADO
    pedido_id INT FOREIGN KEY REFERENCES pedido (id) NOT NULL,
    producto_id INT FOREIGN KEY REFERENCES producto (id) NOT NULL,
);

-- TABLA USADA PARA ALMACENAR LAS facturaS GENERADAS POR LOS pedidoS
DROP TABLE IF EXISTS factura;

CREATE TABLE factura (
    id INT PRIMARY KEY IDENTITY,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE (),
    total DECIMAL(10, 2) NOT NULL,
    NIT VARCHAR(15) NOT NULL DEFAULT 'CF',
    pedido_id INT FOREIGN KEY REFERENCES pedido (id) NOT NULL,
    usuario_vendedor_id INT FOREIGN KEY REFERENCES usuario (id) NOT NULL,
);

-- TABLA DE configuracionES PARA REUTILIZAR EL SOFTWARE EN CASO DE SER NECESARIO
DROP TABLE IF EXISTS configuracion;

CREATE TABLE configuracion (
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    valor VARCHAR(245) NOT NULL,
);

DROP PROCEDURE IF EXISTS p_create_rol;

DROP PROCEDURE IF EXISTS p_list_rol;

DROP PROCEDURE IF EXISTS p_update_rol;

DROP PROCEDURE IF EXISTS p_delete_rol;
GO

CREATE OR ALTER PROCEDURE p_create_rol
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    SET NOCOUNT ON;

    -- Declarar una tabla temporal para almacenar el nuevo ID
    DECLARE @output TABLE (id INT);

    -- Insertar el nuevo rol y capturar el nuevo ID generado
    INSERT INTO rol
        (nombre, descripcion)
    OUTPUT inserted.id INTO @output(id)
    -- Capturamos el nuevo ID en la tabla temporal
    VALUES
        (UPPER(@nombre), UPPER(@descripcion));

    -- Recuperar el nuevo ID desde la tabla temporal
    DECLARE @newId INT;
    SELECT @newId = id
    FROM @output;

    -- Retornar el nuevo ID
    SELECT @newId AS 'id';
-- Retorna el nuevo ID insertado

END;
GO

-- Procedimiento para actualizar un rol existente
CREATE OR ALTER PROCEDURE p_update_rol
    @id INT,
    @json NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    -- Declarar variables para almacenar datos extraídos del JSON
    DECLARE @nombre NVARCHAR(50), @descripcion NVARCHAR(245);

    -- Parsear el JSON
    SELECT
        @nombre = JSON_VALUE(@json, '$.nombre'),
        @descripcion = JSON_VALUE(@json, '$.descripcion');

    -- Actualizar la tabla
    UPDATE rol
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion)
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_list_rol
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        nombre,
        descripcion
    FROM
        rol
    ORDER BY 
        id
    OFFSET 
        @offset ROWS
    FETCH NEXT 
        ISNULL(@limit, 2147483647) ROWS ONLY;
-- Si @limit es NULL, devolvemos todos los registros restantes.
END;
GO

CREATE OR ALTER PROCEDURE p_delete_rol
    @id INT = NULL
AS
BEGIN
    DELETE FROM rol WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_estado_usuario;

DROP PROCEDURE IF EXISTS p_list_estado_usuario;

DROP PROCEDURE IF EXISTS p_update_estado_usuario;

DROP PROCEDURE IF EXISTS p_delete_estado_usuario;
GO

-- Procedimiento para crear un nuevo estado de usuario
CREATE OR ALTER PROCEDURE p_create_estado_usuario
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    INSERT INTO estado_usuario
        (nombre, descripcion)
    VALUES
        (UPPER(@nombre), UPPER(@descripcion));

    SELECT SCOPE_IDENTITY() AS id;
END;
GO

-- Procedimiento para actualizar un estado de usuario existente
CREATE OR ALTER PROCEDURE p_update_estado_usuario
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    UPDATE estado_usuario
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion)
    WHERE id = @id;
END;
GO

-- Procedimiento para listar todos los estados de usuario con paginación
CREATE OR ALTER PROCEDURE p_list_estado_usuario
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, descripcion
    FROM estado_usuario
    ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT ISNULL(@limit, 2147483647) ROWS ONLY;
END;
GO

-- procedimiento para eliminar los estados de usuario
CREATE OR ALTER PROCEDURE p_delete_estado_usuario
    @id INT = NULL
AS
BEGIN
    IF @id < 3
    BEGIN
        RAISERROR ('Este rol es imposible de borrar, el sistema depende de el', 16, 1);
        RETURN;
    END;
    DELETE FROM estado_usuario WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_estado_pedido;

DROP PROCEDURE IF EXISTS p_list_estado_pedido;

DROP PROCEDURE IF EXISTS p_update_estado_pedido;

DROP PROCEDURE IF EXISTS p_delete_estado_pedido;
GO

-- Procedimiento para crear un nuevo estado de pedido
CREATE OR ALTER PROCEDURE p_create_estado_pedido
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    -- CASTEAR TODO A UPPERCASE
    INSERT INTO estado_pedido
        (nombre, descripcion)
    VALUES
        (UPPER(@nombre), UPPER(@descripcion));

    SELECT SCOPE_IDENTITY() AS id;
END;
GO

-- Procedimiento para actualizar un estado de pedido existente
CREATE OR ALTER PROCEDURE p_update_estado_pedido
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    UPDATE estado_pedido
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion)
    WHERE id = @id;
END;
GO

-- Procedimiento para listar todos los estados de pedido con paginación
CREATE OR ALTER PROCEDURE p_list_estado_pedido
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, descripcion
    FROM estado_pedido
    ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT ISNULL(@limit, 2147483647) ROWS ONLY;
END;
GO

-- procedimiento para eliminar los estados de pedido
CREATE OR ALTER PROCEDURE p_delete_estado_pedido
    @id INT = NULL
AS
BEGIN
    IF @id <= 3
    BEGIN
        RAISERROR ('Este rol es imposible de borrar, el sistema depende de el', 16, 1);
        RETURN;
    END;

    DELETE FROM estado_pedido WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_usuario;

DROP PROCEDURE IF EXISTS p_listar_usuarios;

DROP PROCEDURE IF EXISTS p_update_usuario;

DROP PROCEDURE IF EXISTS p_delete_usuario;
GO

-- PROCEDIMIENTO ALMACENADO PARA INSERTAR usuarioS EN LA BASE DE DATOS
CREATE OR ALTER PROCEDURE p_create_usuario
    @email VARCHAR(50),
    @nombre_completo VARCHAR(50),
    @NIT VARCHAR(15),
    @password VARCHAR(75),
    @telefono VARCHAR(10),
    @fecha_nacimiento DATE,
    @rol_id INT,
    @estado_usuario_id INT
AS
BEGIN
    INSERT INTO usuario
        (email, nombre_completo, NIT, password, telefono, fecha_nacimiento, rol_id, estado_usuario_id)
    VALUES
        (@email, @nombre_completo, @NIT, @password, @telefono, @fecha_nacimiento, @rol_id, @estado_usuario_id);
    -- RETORNAMOS EL NUEVO ID
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

-- Procedimiento para actualizar un usuario existente
CREATE OR ALTER PROCEDURE p_update_usuario
    @id INT,
    @email VARCHAR(50),
    @nombre_completo VARCHAR(50),
    @NIT VARCHAR(15),
    @password VARCHAR(75),
    @telefono VARCHAR(10),
    @fecha_nacimiento DATE,
    @estado_usuario_id INT,
    @rol_id INT
AS
BEGIN
    -- UPDATE ONLY VALUES WICH ARE NOT NULL
    UPDATE usuario
    SET email = COALESCE(@email, email),
        nombre_completo = COALESCE(@nombre_completo, nombre_completo),
        NIT = COALESCE(@NIT, NIT),
        password = COALESCE(@password, password),
        telefono = COALESCE(@telefono, telefono),
        fecha_nacimiento = COALESCE(@fecha_nacimiento, fecha_nacimiento),
        estado_usuario_id = COALESCE(@estado_usuario_id, estado_usuario_id),
        rol_id = COALESCE(@rol_id, rol_id)
    WHERE id = @id;
END;
GO

-- Procedimiento para eliminar un usuario por ID
CREATE OR ALTER PROCEDURE p_delete_usuario
    @id INT
AS
BEGIN
    -- TODO: se que lo correcto es simplemente inhabilitar el usuario, pero por fines practicos lo eliminare
    BEGIN TRY
        DELETE FROM usuario
        WHERE id = @id;

        SELECT 'El usuario se ha borrado exitosamente, no habian registros ligados a el' AS mensaje;
        RETURN;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() = 547 -- Error de restricción de clave externa
        BEGIN
        UPDATE usuario
            SET estado_usuario_id = (SELECT id
        FROM estado_usuario
        WHERE UPPER(nombre) = UPPER('Inhabilitado'))
            WHERE id = @id
        --  SHOW THE FINAL MESSAGE TO THE USER
        SELECT 'El usuario no puede ser borrado, pero se ha deshabilitado.' AS mensaje;
    END
    END CATCH;
END;
GO

-- Procedimiento para listar usuarios con paginación
CREATE OR ALTER PROCEDURE p_list_usuario
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id
    FROM usuario
    ORDER BY id
        OFFSET @offset ROWS
    FETCH NEXT ISNULL(@limit, 2147483647) ROWS ONLY;

END;
GO

-- Procedimiento para buscar un usuario por ID
CREATE OR ALTER PROCEDURE p_search_usuario
    @id INT,
    @email VARCHAR(50)
AS
BEGIN
    IF @id IS NOT NULL
    BEGIN
        SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id, password
        FROM usuario
        WHERE id = @id;
        RETURN
    END;
    ELSE IF @email IS NOT NULL
    BEGIN
        SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id, password
        FROM usuario
        WHERE email = @email;
        RETURN
    END;
END;

GO
DROP PROCEDURE IF EXISTS p_create_direccion_cliente;

DROP PROCEDURE IF EXISTS p_list_direccion_cliente;

DROP PROCEDURE IF EXISTS p_update_direccion_cliente;

DROP PROCEDURE IF EXISTS p_delete_direccion_cliente;

DROP PROCEDURE IF EXISTS p_search_direccion_cliente;
GO

CREATE OR ALTER PROCEDURE p_create_direccion_cliente
    @departamento VARCHAR(50),
    @municipio VARCHAR(50),
    @direccion VARCHAR(100),
    @telefono VARCHAR(10) = NULL,
    @usuario_id INT
AS
BEGIN

    INSERT INTO direccion_cliente
        (departamento, municipio, direccion, telefono, usuario_id)
    VALUES
        (@departamento, @municipio, @direccion, @telefono, @usuario_id);
-- Retorna el nuevo ID generado: MANEJADO POR EL TRIGGER
END;
GO

-- DISABLE THE UPDATE OF USER REFERENCE DIRECTION
CREATE OR ALTER PROCEDURE p_update_direccion_cliente
    @id INT,
    @departamento VARCHAR(50) = NULL,
    @municipio VARCHAR(50) = NULL,
    @direccion VARCHAR(100) = NULL,
    @telefono VARCHAR(10) = NULL
AS
BEGIN
    UPDATE direccion_cliente
    SET departamento = COALESCE(@departamento, departamento),
        municipio = COALESCE(@municipio, municipio),
        direccion = COALESCE(@direccion, direccion),
        telefono = COALESCE(@telefono, telefono)
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_direccion_cliente
    @id INT
AS
BEGIN
    DELETE FROM direccion_cliente
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_list_direccion_cliente
    @usuario_id INT = NULL,
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id, departamento, municipio, direccion, telefono, usuario_id
    FROM direccion_cliente
    WHERE (@usuario_id IS NULL OR usuario_id = @usuario_id)
    ORDER BY id
    OFFSET @offset ROWS
    FETCH NEXT ISNULL(@limit, 2147483647) ROWS ONLY;
END;

GO

CREATE OR ALTER PROCEDURE p_search_direccion_cliente
    @id INT
AS
BEGIN
    SELECT id, departamento, municipio, direccion, telefono, usuario_id
    FROM direccion_cliente
    WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_categoria_producto;

DROP PROCEDURE IF EXISTS p_list_categoria_producto;

DROP PROCEDURE IF EXISTS p_update_categoria_producto;

DROP PROCEDURE IF EXISTS p_delete_categoria_producto;
GO

CREATE OR ALTER PROCEDURE p_create_categoria_producto
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    INSERT INTO categoria_producto
        (nombre, descripcion)
    VALUES
        (@nombre, @descripcion);

    -- Retorna el nuevo ID generado
    SELECT SCOPE_IDENTITY() AS id;
END;
GO

CREATE OR ALTER PROCEDURE p_update_categoria_producto
    @id INT,
    @nombre VARCHAR(50) = NULL,
    @descripcion VARCHAR(245) = NULL
AS
BEGIN
    UPDATE categoria_producto
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion)
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_categoria_producto
    @id INT
AS
BEGIN
    DELETE FROM categoria_producto
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_list_categoria_producto
    @limit INT = NULL,
    @offset INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id, nombre, descripcion
    FROM categoria_producto
    ORDER BY id OFFSET @offset ROWS
    FETCH NEXT ISNULL(@limit, 2147483647) ROWS ONLY;
END;

GO

CREATE OR ALTER PROCEDURE p_search_producto
    @id INT = NULL,
    @nombre VARCHAR(50) = NULL
AS
BEGIN



    IF @id IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id
        FROM producto
        WHERE id = @id;
        RETURN;
    END
    SELECT id, nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id
    FROM producto
    WHERE nombre = @nombre;
END;

GO
DROP PROCEDURE IF EXISTS p_create_estado_producto;

DROP PROCEDURE IF EXISTS p_list_estado_producto;

DROP PROCEDURE IF EXISTS p_update_estado_producto;

DROP PROCEDURE IF EXISTS p_delete_estado_producto;
GO

CREATE OR ALTER PROCEDURE p_create_estado_producto
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    IF @nombre IS NULL OR @nombre = ''
    BEGIN
        RAISERROR ('El nombre es obligatorio.', 16, 1);
        RETURN;
    END;

    IF @descripcion IS NULL OR @descripcion = ''
    BEGIN
        RAISERROR ('La descripcion es obligatoria.', 16, 1);
        RETURN;
    END;

    INSERT INTO estado_producto
        (nombre, descripcion)
    VALUES
        (UPPER(@nombre), UPPER(@descripcion));

    SELECT SCOPE_IDENTITY() AS 'id';
END;
GO

CREATE OR ALTER PROCEDURE p_update_estado_producto
    @id INT,
    @nombre VARCHAR(50) = NULL,
    @descripcion VARCHAR(245) = NULL
AS
BEGIN
    IF @nombre IS NULL AND @descripcion IS NULL
    BEGIN
        RAISERROR ('Al menos uno de los parámetros @nombre o @descripcion debe ser no nulo.', 16, 1);
        RETURN;
    END;

    UPDATE estado_producto
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion)
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_estado_producto
    @id INT
AS
BEGIN
    IF @id < 4
    BEGIN
        RAISERROR ('Este rol es imposible de borrar, el sistema depende de el', 16, 1);
        RETURN;
    END;


    DELETE FROM estado_producto
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_list_estado_producto
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_producto
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_producto
        ORDER BY id
        OFFSET @offset ROWS;
    END
END;

GO
DROP PROCEDURE IF EXISTS p_create_producto;

DROP PROCEDURE IF EXISTS p_list_producto;

DROP PROCEDURE IF EXISTS p_update_producto;

DROP PROCEDURE IF EXISTS p_delete_producto;

DROP PROCEDURE IF EXISTS p_get_producto;
GO

CREATE OR ALTER PROCEDURE p_create_producto
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245),
    @precio DECIMAL(10, 2),
    @precio_mayorista DECIMAL(10, 2) = NULL,
    @stock INT,
    @estado_producto_id INT = 1,
    @categoria_producto_id INT = NULL
AS
BEGIN
    IF @stock < 0
    BEGIN
        RAISERROR ('El stock no puede ser negativo.', 16, 1);
        return;
    END;

    INSERT INTO producto
        (nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id)
    VALUES
        (UPPER(@nombre), LOWER(@descripcion), @precio, @precio_mayorista, @stock, @estado_producto_id, @categoria_producto_id);

    SELECT SCOPE_IDENTITY() AS id;
END;
GO

CREATE OR ALTER PROCEDURE p_update_producto
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245),
    @precio DECIMAL(10, 2) = NULL,
    @precio_mayorista DECIMAL(10, 2) = NULL,
    @stock INT = NULL,
    @estado_producto_id INT,
    @categoria_producto_id INT = NULL
AS
BEGIN
    -- VERIFICA QUE EL PRECIO NO SEA MENOR A 0 Y QUE EL STOCK NO SEA NEGATIVO
    -- ADEMAS VERIFICA QUE EL PRECIO MAYORISTA NO SEA MAYOR AL PRECIO DE VENTA

    IF @precio < 0
    BEGIN
        RAISERROR ('El precio no puede ser menor a 0.', 16, 1);
        RETURN;
    END;

    IF @stock < 0
    BEGIN
        RAISERROR ('El stock no puede ser menor a 0.', 16, 1);
        RETURN;
    END;

    -- Verificar que el precio mayorista no sea mayor que el precio de venta
    IF (@precio_mayorista IS NOT NULL AND @precio IS NOT NULL) AND @precio_mayorista > @precio
    BEGIN
        RAISERROR ('El precio mayorista no puede ser mayor al precio de venta.', 16, 1);
        RETURN;
    END;

    -- Verificar cuando al menos un valor de dinero es NULL
    IF COALESCE(@precio, (SELECT precio FROM producto WHERE id = @id)) <= 
        (COALESCE(@precio_mayorista, (SELECT precio_mayorista FROM producto WHERE id = @id)))
    BEGIN
        RAISERROR ('El precio mayorista no puede ser mayor o igual al precio de venta.', 16, 1);
        RETURN;
    END;

    -- Actualizar el producto con los valores proporcionados, solo si no son NULL
    UPDATE producto
    SET nombre = COALESCE(@nombre, nombre),
        descripcion = COALESCE(@descripcion, descripcion),
        precio = COALESCE(@precio, precio),
        precio_mayorista = COALESCE(@precio_mayorista, precio_mayorista),
        stock = COALESCE(@stock, stock),
        estado_producto_id = COALESCE(@estado_producto_id, estado_producto_id),
        categoria_producto_id = COALESCE(@categoria_producto_id, categoria_producto_id)
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_producto
    @id INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Intentar eliminar los detalles relacionados con el producto
        DELETE FROM detalle_pedido
        WHERE producto_id = @id;

        -- Intentar eliminar el producto
        DELETE FROM producto
        WHERE id = @id;
        -- Confirmar la transacción si todo salió bien
        COMMIT TRANSACTION;
       -- Retornar mensaje de éxito al eliminar
        SELECT 'El producto se ha eliminado correctamente.' AS mensaje;
    END TRY
    BEGIN CATCH
        -- Revertir la transacción si ocurrió un error
        ROLLBACK TRANSACTION;
        -- Actualizar el estado del producto a deshabilitado
        UPDATE producto
        SET estado_producto_id = 2
        WHERE id = @id;
            -- Retornar mensaje de deshabilitación
        SELECT 'El producto no se pudo eliminar, pero ha sido deshabilitado.' AS mensaje;
    END CATCH;
END;

GO

CREATE OR ALTER PROCEDURE p_list_producto
    @limit INT = NULL,
    @offset INT = 0,
    @status_product_id INT = NULL
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);

    -- INICIALIZAR LA CONSULTA SQL
    SET @sql = 'SELECT p.id, p.nombre, p.descripcion, p.precio, p.precio_mayorista, p.stock, 
                p.estado_producto_id, p.categoria_producto_id, 
                e.nombre AS estado_nombre, 
                c.nombre AS categoria_nombre, c.descripcion AS categoria_descripcion 
                FROM producto AS p 
                INNER JOIN categoria_producto AS c ON p.categoria_producto_id = c.id
                INNER JOIN estado_producto AS e ON p.estado_producto_id = e.id';

    -- Agregar filtro por estado_producto_id si es necesario
    IF @status_product_id IS NOT NULL
    BEGIN
        SET @sql = @sql + ' WHERE p.estado_producto_id = @status_product_id';
    END

    -- Agregar cláusula ORDER BY, OFFSET y FETCH
    SET @sql = @sql + ' ORDER BY p.id OFFSET @offset ROWS';

    -- Manejar el límite, si se proporciona
    IF @limit IS NOT NULL
    BEGIN
        SET @sql = @sql + ' FETCH NEXT @limit ROWS ONLY';
    END

    -- Ejecutar la consulta dinámica
    EXEC sp_executesql @sql, N'@limit INT, @offset INT, @status_product_id INT', @limit, @offset, @status_product_id;
END;
GO

CREATE OR ALTER PROCEDURE p_get_producto
    @id INT
AS
BEGIN
    SELECT p.id, p.nombre, p.descripcion, p.precio, p.precio_mayorista, p.stock, p.estado_producto_id, p.categoria_producto_id,
    cp.nombre AS categoria_nombre, cp.descripcion AS categoria_descripcion
    FROM producto AS p
    INNER JOIN categoria_producto AS cp 
    ON p.categoria_producto_id = cp.id
    WHERE p.id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_detalle_pedido;

DROP PROCEDURE IF EXISTS p_list_detalles_pedido;

DROP PROCEDURE IF EXISTS p_update_detalle_pedido;

DROP PROCEDURE IF EXISTS p_delete_detalle_pedido;

DROP PROCEDURE IF EXISTS p_create_pedido;

DROP PROCEDURE IF EXISTS p_list_pedido;

DROP PROCEDURE IF EXISTS p_search_pedido;

DROP PROCEDURE IF EXISTS p_delete_pedido;

DROP PROCEDURE IF EXISTS p_update_pedido;

GO

CREATE OR ALTER PROCEDURE p_list_detalles_pedido
    @pedido_id INT
AS
BEGIN
    -- Seleccionar todos los detalles del pedido especificado por @pedido_id
    SELECT
        dp.id AS id,
        dp.cantidad,
        dp.precio_venta,
        (dp.cantidad * dp.precio_venta) AS subtotal, -- Subtotal calculado
        dp.producto_id,
        p.nombre AS producto_nombre,
        -- Dirección extendida como string JSON
        (
            SELECT
            direccion_cliente.direccion AS [direccion],
            direccion_cliente.municipio AS [municipio],
            direccion_cliente.departamento AS [departamento],
            direccion_cliente.telefono AS [telefono]
        FROM
            direccion_cliente
            INNER JOIN pedido ON direccion_cliente.id = pedido.direccion_entrega_id
        WHERE 
                pedido.id = dp.pedido_id
        FOR JSON PATH, INCLUDE_NULL_VALUES
        ) AS direccion_detallada
    FROM
        detalle_pedido dp
        INNER JOIN
        producto p ON dp.producto_id = p.id
    WHERE 
        dp.pedido_id = @pedido_id
    ORDER BY dp.id DESC;
END;

GO

CREATE OR ALTER PROCEDURE p_create_detalle_pedido
    @cantidad INT,
    @precio_venta DECIMAL(10, 2),
    @pedido_id INT,
    @producto_id INT
AS
BEGIN
    -- Insertar un nuevo detalle en la tabla detalle_pedido
    INSERT INTO detalle_pedido
        (cantidad, precio_venta, pedido_id, producto_id)
    VALUES
        (@cantidad, @precio_venta, @pedido_id, @producto_id);

END;

GO

CREATE OR ALTER PROCEDURE p_update_detalle_pedido
    @id INT,
    -- ID del detalle que se desea actualizar
    @cantidad INT,
    -- Nueva cantidad
    @precio_venta DECIMAL(10, 2)
-- Nuevo ID del producto (si es necesario modificarlo)
AS
BEGIN
    -- Actualizar el detalle del pedido con los nuevos valores
    UPDATE detalle_pedido
    SET 
        cantidad = @cantidad,
        precio_venta = @precio_venta
    WHERE id = @id;
END;

GO

CREATE OR ALTER PROCEDURE p_delete_detalle_pedido
    @id INT = NULL,
    -- ID del detalle a borrar
    @pedido_id INT = NULL
-- Pedido ID para borrar todos los detalles
AS
BEGIN
    -- Si se proporciona un ID, borrar el detalle específico
    IF @id IS NOT NULL
    BEGIN
        DELETE FROM detalle_pedido
        WHERE id = @id;
    END
    -- Si se proporciona un pedido_id, borrar todos los detalles asociados a ese pedido
    ELSE IF @pedido_id IS NOT NULL
    BEGIN
        DELETE FROM detalle_pedido
        WHERE pedido_id = @pedido_id;
    END
    -- Si no se proporciona ningún parámetro, no hacer nada o devolver un mensaje de error
    ELSE
    BEGIN
        PRINT 'Debe proporcionar al menos un parámetro: id o pedido_id.';
    END
END;

GO

CREATE OR ALTER PROCEDURE p_create_pedido
    @usuario_id INT,
    @direccion_entrega_id INT,
    @estado_pedido_id INT,
    @json_detalles NVARCHAR(MAX)
AS
BEGIN
    -- Procesar el JSON y extraer los detalles
    DECLARE @Detalles TABLE (
        cantidad INT,
        precio_venta DECIMAL(10, 2),
        producto_id INT
        );

    -- Iniciar una transacción
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Variables para almacenar el total y los valores extraídos del JSON
        DECLARE @total DECIMAL(10, 2) = 0;
        -- Variables para los valores de cada detalle del pedido
        DECLARE @producto_id INT, @cantidad INT, @precio_venta DECIMAL(10, 2);
        -- Crear el pedido y obtener el ID generado
        DECLARE @pedido_id INT;
        -- Insertar el pedido (sin el total) primero, ya que se calculará después
        INSERT INTO pedido
        (total, usuario_id, direccion_entrega_id, estado_pedido_id)
    VALUES
        (@total, @usuario_id, @direccion_entrega_id, @estado_pedido_id);

        -- Obtener el ID del pedido recién insertado
        SET @pedido_id = SCOPE_IDENTITY();

        -- Insertar los detalles desde el JSON en la tabla temporal
        INSERT INTO @Detalles
        (producto_id, cantidad, precio_venta)
    SELECT
        producto_id, cantidad, precio_venta
    FROM OPENJSON(@json_detalles)
                WITH (
                    producto_id INT,
                    cantidad INT,
                    precio_venta DECIMAL(10, 2)
                );


    -- Insertar los detalles del pedido en la tabla detalle_pedido
        DECLARE detalle_cursor CURSOR FOR
        SELECT producto_id, cantidad, precio_venta
    FROM @Detalles;

        OPEN detalle_cursor;

        FETCH NEXT FROM detalle_cursor INTO @producto_id, @cantidad, @precio_venta;

        -- Iterar sobre los detalles y calcular el total
        WHILE @@FETCH_STATUS = 0
        BEGIN
        -- Calcular el total para cada detalle
        SET @total = @total + (@cantidad * @precio_venta);

        -- Insertar el detalle en la tabla detalle_pedido
        -- INSERT INTO detalle_pedido
        --     (pedido_id, producto_id, cantidad, precio_venta)
        -- VALUES
        --     (@pedido_id, @producto_id, @cantidad, @precio_venta);
        EXEC p_create_detalle_pedido @cantidad, @precio_venta, @pedido_id, @producto_id;
        -- DESCONTAR EL STOCK DEL PRODUCTO
        DECLARE @new_stock INT;
        SET @new_stock = (SELECT stock
        FROM producto
        WHERE id = @producto_id) - @cantidad;
        EXEC p_update_producto @producto_id, NULL, NULL, NULL, NULL, @new_stock, NULL, NULL;

        FETCH NEXT FROM detalle_cursor INTO @producto_id, @cantidad, @precio_venta;
    END;

        CLOSE detalle_cursor;
        DEALLOCATE detalle_cursor;


        -- Actualizar el total del pedido
        UPDATE pedido
        SET total = @total
        WHERE id = @pedido_id;

        -- Si todo salió bien, hacer commit
        COMMIT TRANSACTION;

        -- Retornar el ID del pedido creado
        SELECT @pedido_id AS id;

    END TRY
    BEGIN CATCH
        -- Si ocurre un error, hacer rollback
        ROLLBACK TRANSACTION;
        -- Retornar el mensaje de error
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE p_list_pedido
    @limit INT = NULL,
    @offset INT = NULL,
    @target_state INT = NULL,
    @target_user INT = NULL
AS
BEGIN
    SELECT
        p.id,
        p.fecha_creacion,
        p.fecha_confirmacion,
        p.fecha_entrega,
        p.total,
        p.usuario_validador_id,
        p.usuario_id,
        p.direccion_entrega_id,
        p.estado_pedido_id,
        ep.nombre AS estado_nombre
    FROM
        pedido AS p
        INNER JOIN estado_pedido AS ep ON ep.id = p.estado_pedido_id
    WHERE 
        (@target_state IS NULL OR estado_pedido_id = @target_state) AND
        (@target_user IS NULL OR usuario_id = @target_user)
    ORDER BY 
        estado_pedido_id ASC, id DESC
    OFFSET 
        ISNULL(@offset, 0) ROWS
    FETCH NEXT 
        ISNULL(@limit, 2147483647) ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_pedido
    @id INT
AS
BEGIN
    -- Verificar el estado del pedido
    DECLARE @estado_pedido_id INT;
    SELECT @estado_pedido_id = estado_pedido_id
    FROM pedido
    WHERE id = @id;

    -- Si el estado del pedido es distinto de 1, lanzar un error
    IF @estado_pedido_id != 1
    BEGIN
        RAISERROR ('No se puede eliminar el pedido, ya ha sido validado.', 16, 1);
        RETURN;
    END

    -- Se puede borrar o invalidar el pedido
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Obtener todos los detalles del pedido
        DECLARE @detalle_id INT, @producto_id INT, @cantidad INT;

        DECLARE detalle_cursor CURSOR FOR
        SELECT id, producto_id, cantidad
    FROM detalle_pedido
    WHERE pedido_id = @id;

        OPEN detalle_cursor;
        FETCH NEXT FROM detalle_cursor INTO @detalle_id, @producto_id, @cantidad;

        -- Restaurar el stock de los productos del pedido
        WHILE @@FETCH_STATUS = 0
        BEGIN
        -- Actualizar el stock del producto
        UPDATE producto
            SET stock = stock + @cantidad
            WHERE id = @producto_id;

        -- Eliminar el detalle del pedido
        DELETE FROM detalle_pedido
            WHERE id = @detalle_id;

        FETCH NEXT FROM detalle_cursor INTO @detalle_id, @producto_id, @cantidad;
    END

        CLOSE detalle_cursor;
        DEALLOCATE detalle_cursor;

        -- Eliminar el pedido
        DELETE FROM pedido
        WHERE id = @id;

        -- Confirmar la transacción
        COMMIT TRANSACTION;

        -- Retornar un mensaje de éxito
        SELECT 'El pedido se ha eliminado exitosamente y el stock ha sido restaurado.' AS mensaje;
    END TRY
    BEGIN CATCH
        -- En caso de error, revertir la transacción
        ROLLBACK TRANSACTION;
        RAISERROR ('Se ha producido un error y la transacción ha sido revertida', 16, 1);
        RETURN;
    END CATCH
END;

GO

CREATE OR ALTER PROCEDURE p_search_pedido
    @id INT
AS
BEGIN
    SELECT id, fecha_creacion, fecha_confirmacion, fecha_entrega, total,
        usuario_validador_id, usuario_id, direccion_entrega_id, estado_pedido_id
    FROM pedido
    WHERE id = @id;
END;

GO

CREATE OR ALTER PROCEDURE p_cambiar_estado_pedido
    @pedido_id INT,
    @nuevo_estado_id INT
AS
BEGIN
    -- Verificar si el pedido existe
    IF NOT EXISTS (SELECT 1 FROM pedido WHERE id = @pedido_id)
    BEGIN
        RAISERROR ('El pedido no existe.', 16, 1);
        RETURN;
    END

    -- Actualizar el estado del pedido
    UPDATE pedido
    SET estado_pedido_id = @nuevo_estado_id,
        fecha_confirmacion = CASE WHEN @nuevo_estado_id = 2 THEN GETDATE() ELSE fecha_confirmacion END,
        fecha_entrega = CASE WHEN @nuevo_estado_id = 4 THEN GETDATE() ELSE fecha_entrega END
    WHERE id = @pedido_id;
END;

GO

CREATE OR ALTER PROCEDURE p_update_pedido
    @id INT,
    @json_detalles NVARCHAR(MAX)
AS
BEGIN
    -- Variables para almacenar datos del pedido
    DECLARE @direccion_id INT;
    DECLARE @estado_id INT;
    DECLARE @usuario_id INT;

    -- Validar estado del pedido
    SELECT @estado_id = estado_pedido_id FROM pedido WHERE id = @id;

    IF @estado_id != 1
    BEGIN
        RAISERROR ('No se puede modificar el pedido, ya ha sido validado.', 16, 1);
        RETURN;
    END


     -- Recuperar dirección y usuario actuales del pedido
    SELECT @direccion_id = direccion_entrega_id, 
           @usuario_id = usuario_id  
    FROM pedido 
    WHERE id = @id;


    -- Iniciar transacción
    BEGIN TRANSACTION;



    BEGIN TRY
        -- Eliminar los detalles actuales del pedido
        EXEC p_delete_pedido @id;

        -- Crear nuevos detalles para el pedido
        EXEC p_create_pedido @usuario_id, @direccion_id, 1, @json_detalles;

       -- Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
    --     -- Si ocurre un error, revertir la transacción
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

GO

DROP TRIGGER IF EXISTS t_validar_direccion_usuario;

DROP PROCEDURE IF EXISTS p_cambiar_estado_producto;

DROP PROCEDURE IF EXISTS p_config_predefinidos;
GO

-- VERIFICAMOS QUE AL MOMENTO DE GUARDAR UNA DIRECCION, ESTA SEA PARA UN usuario QUE SEA CLIENTE
CREATE OR ALTER TRIGGER t_validar_direccion_usuario
    ON direccion_cliente
    INSTEAD OF INSERT
    AS 
BEGIN
    DECLARE @rol_id INT;

    -- Verificamos si todos los usuarios que intentan insertar tienen rol 1 (Cliente)
    IF EXISTS (
        SELECT 1
    FROM inserted i
        JOIN usuario u ON i.usuario_id = u.id
    WHERE u.rol_id != 1
    )
    BEGIN
        RAISERROR ('Solo los usuarios con rol de Cliente pueden tener direcciones de entrega.', 16, 1);
        RETURN;
    END

    -- Si todos los usuarios tienen rol 1, realizamos la inserción en la tabla direccion_cliente
    INSERT INTO direccion_cliente
        (departamento, municipio, direccion, telefono, usuario_id)
    OUTPUT
    INSERTED.id
    -- Captura el ID generado
    SELECT departamento, municipio, direccion, telefono, usuario_id
    FROM inserted;
END;
GO

-- PROCEDIMIENTO SOLICITADO TAREA, CAMBIAR ESTADO DE UN producto
CREATE OR ALTER PROCEDURE p_cambiar_estado_producto
    @producto_id INT,
    @estado_producto_id INT
AS
BEGIN
    UPDATE producto
    SET estado_producto_id = @estado_producto_id
    WHERE id = @producto_id;
END;
GO

-- PROCEDIMIENTO ALMACENADO PARA INSERTAR pedidoS Y DETALLES DE pedidoS, NO SE DEBE LLAMAR EN PRODUCCION, SOLO ME SIRVE PARA LLENAR LA BD DINAMICAMENTE
CREATE OR ALTER PROCEDURE p_config_predefinidos
    @num_pedidos INT,
    @num_no_confirmados INT
AS
BEGIN
    SET NOCOUNT ON
    -- INSERTS PARA ROLES
    EXEC p_create_rol 'Cliente', 'usuario que compra productos';
    EXEC p_create_rol 'Operativo', 'usuario que gestiona el sistema';

    -- INSERTS PARA ESTADOS DE usuario
    EXEC p_create_estado_usuario 'Inhabilitado', 'usuario sin acceso';
    EXEC p_create_estado_usuario 'Pendiente de activar', 'usuario pendiente de activación';
    EXEC p_create_estado_usuario 'Activado', 'usuario con acceso';

    -- INSERTS PARA ESTADOS DE pedido
    EXEC p_create_estado_pedido 'Pendiente Validar', 'pedido pendiente de validación';
    EXEC p_create_estado_pedido 'Confirmado', 'pedido confirmado';
    EXEC p_create_estado_pedido 'Enviado', 'pedido enviado';
    EXEC p_create_estado_pedido 'Entregado', 'pedido entregado';

    -- INSERTS PARA ESTADO DE producto    
    EXEC p_create_estado_producto 'Habilitado', 'producto disponible para la venta';
    EXEC p_create_estado_producto 'Deshabilitado', 'producto no disponible para la venta';
    EXEC p_create_estado_producto 'Descontinuado', 'producto que ya no se vende';


    -- INSERTS PARA usuarioS CLIENTES: DEFAULT PASS: password
    EXEC p_create_usuario 'cliente1@example.com', 'Cliente Uno', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567890', '1990-01-01', 1, 3;
    EXEC p_create_usuario 'cliente2@example.com', 'Cliente Dos', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567891', '1991-02-02', 1, 3;
    EXEC p_create_usuario 'cliente3@example.com', 'Cliente Tres', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567892', '1992-03-03', 1, 3;
    EXEC p_create_usuario 'cliente4@example.com', 'Cliente Cuatro', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567893', '1993-04-04', 1, 3;
    EXEC p_create_usuario 'cliente5@example.com', 'Cliente Cinco', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567894', '1994-05-05', 1, 3;
    EXEC p_create_usuario 'cliente6@example.com', 'Cliente Seis', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567895', '1995-06-06', 1, 3;
    EXEC p_create_usuario 'cliente7@example.com', 'Cliente Siete', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567896', '1996-07-07', 1, 3;
    EXEC p_create_usuario 'cliente8@example.com', 'Cliente Ocho', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567897', '1997-08-08', 1, 3;
    EXEC p_create_usuario 'cliente9@example.com', 'Cliente Nueve', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567898', '1998-09-09', 1, 3;
    EXEC p_create_usuario 'cliente10@example.com', 'Cliente Diez', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567899', '1999-10-10', 1, 3;
    -- INSERTS PARA usuarioS OPERATIVOS
    EXEC p_create_usuario 'operativo1@example.com', 'Operativo Uno', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '0987654322', '1981-02-02', 2, 3;
    EXEC p_create_usuario 'operativo2@example.com', 'Operativo Dos', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '0987654322', '1981-02-02', 2, 3;

    -- INSERTS PARA DIRECCIONES DE CLIENTES
    EXEC p_create_direccion_cliente 'Departamento1', 'Municipio1', 'Direccion1', '1234567890', 1;
    EXEC p_create_direccion_cliente 'Departamento2', 'Municipio2', 'Direccion2', '1234567891', 2;
    EXEC p_create_direccion_cliente 'Departamento3', 'Municipio3', 'Direccion3', '1234567892', 3;
    EXEC p_create_direccion_cliente 'Departamento4', 'Municipio4', 'Direccion4', '1234567893', 4;
    EXEC p_create_direccion_cliente 'Departamento5', 'Municipio5', 'Direccion5', '1234567894', 5;
    EXEC p_create_direccion_cliente 'Departamento6', 'Municipio6', 'Direccion6', '1234567895', 6;
    EXEC p_create_direccion_cliente 'Departamento7', 'Municipio7', 'Direccion7', '1234567896', 7;
    EXEC p_create_direccion_cliente 'Departamento8', 'Municipio8', 'Direccion8', '1234567897', 8;
    EXEC p_create_direccion_cliente 'Departamento9', 'Municipio9', 'Direccion9', '1234567898', 9;
    EXEC p_create_direccion_cliente 'Departamento10', 'Municipio10', 'Direccion10', '1234567899', 10;
    EXEC p_create_direccion_cliente 'Departamento11', 'Municipio11', 'Direccion11', '1234567899', 10;


    -- INSERTS PARA CATEGORIAS DE productoS

    EXEC p_create_categoria_producto 'Alimentos', 'productos alimenticios de uso diario';
    EXEC p_create_categoria_producto 'Bebidas', 'Bebidas de consumo diario';
    EXEC p_create_categoria_producto 'Limpieza', 'productos de limpieza y aseo';
    EXEC p_create_categoria_producto 'Higiene Personal', 'productos de higiene personal';
    EXEC p_create_categoria_producto 'Papelería', 'productos de papelería y oficina';

    -- INSERTS PARA productos

    DECLARE @i INT = 1;
    -- Contador para el bucle
    DECLARE @max_products INT = 30;
    -- Número total de productos que deseas insertar
    DECLARE @nombre NVARCHAR(50);
    DECLARE @descripcion NVARCHAR(245);
    DECLARE @precio DECIMAL(10, 2);
    DECLARE @precio_mayorista DECIMAL(10, 2);
    DECLARE @stock INT;
    DECLARE @categoria_producto_id INT;

    WHILE @i <= @max_products
    BEGIN
        -- Generar valores dinámicos
        SET @nombre = CONCAT('Producto ', @i);
        SET @descripcion = CONCAT('Descripción de ', @nombre);
        SET @precio = ROUND(1.00 + RAND() * 9.00, 2);
        -- Precio aleatorio entre 1.00 y 10.00
        SET @precio_mayorista = ROUND(@precio * 0.90, 2);
        -- Precio mayorista es el 90% del precio normal
        SET @stock = FLOOR(RAND() * 41);
        -- Stock aleatorio entre 0 y 40
        SET @categoria_producto_id = FLOOR(RAND() * 5) + 1;
        -- Categoría aleatoria entre 1 y 5

        -- Ejecutar el procedimiento almacenado
        EXEC p_create_producto 
        @nombre, 
        @descripcion, 
        @precio, 
        @precio_mayorista, 
        @stock, 
        1, -- Estado siempre 1
        @categoria_producto_id;

        -- Incrementar el contador
        SET @i = @i + 1;
    END;


    -- INSERTAMOS DATOS USADOS PARA CONFIGURAR EL SISTEMA
    INSERT INTO configuracion
        (nombre, valor)
    VALUES
        ('IVA', '12'),
        ('CANTIDAD_MAYORISTAS', '12'),
        ('NOMBRE_APLICACION', 'Mi Tienda Online');

    SET @i = 1;
    DECLARE @total DECIMAL(10, 2);
    DECLARE @cantidad INT;
    DECLARE @precio_venta DECIMAL(10, 2);
    DECLARE @producto_id INT;
    DECLARE @estado_pedido_id INT;
    DECLARE @fecha_creacion_tmp DATE;
    DECLARE @fecha_factura_tmp DATE;
    DECLARE @usuario_id_tmp INT;

    WHILE @i <= @num_pedidos
    BEGIN
        -- Generar un total aleatorio para el pedido
        SET @total = 0;
        SET @estado_pedido_id = CASE 
            WHEN @num_no_confirmados < @i THEN CASE WHEN RAND() < 0.5 THEN 2 ELSE 4 END 
            ELSE 1 
        END;
        SET @usuario_id_tmp = FLOOR(RAND() * 10) + 1;
        SET @fecha_creacion_tmp = DATEADD(DAY, -FLOOR(RAND() * 730), GETDATE());
        SET @fecha_factura_tmp = DATEADD(DAY, FLOOR(RAND() * 4) + 1, @fecha_creacion_tmp);
        -- Insertar el pedido
        INSERT INTO pedido
            (fecha_creacion, fecha_confirmacion, fecha_entrega, total, usuario_id, direccion_entrega_id, estado_pedido_id, usuario_validador_id)
        VALUES
            (
                @fecha_creacion_tmp,
                CASE WHEN @estado_pedido_id = 1 THEN NULL ELSE DATEADD(DAY, 1, @fecha_creacion_tmp)  END,
                CASE WHEN @estado_pedido_id = 1 THEN NULL ELSE @fecha_factura_tmp END,
                0,
                @usuario_id_tmp,
                (SELECT TOP 1
                    id
                FROM direccion_cliente
                WHERE usuario_id = @usuario_id_tmp),
                @estado_pedido_id,
                CASE WHEN @i % 2 = 0 THEN 11 ELSE 12 END);

        -- Obtener el ID del pedido recién insertado
        DECLARE @pedido_id INT = SCOPE_IDENTITY();

        -- Generar entre 1 y 2 detalles de pedido
        DECLARE @j INT = 1;
        WHILE @j <= FLOOR(RAND() * 4) + 1
            BEGIN
            SET @producto_id = FLOOR(RAND() * @max_products) + 1;
            SET @cantidad = FLOOR(RAND() * 10) + 1;
            SELECT @precio_venta = precio
            FROM producto
            WHERE id = @producto_id;

            -- Insertar el detalle del pedido
            INSERT INTO detalle_pedido
                (cantidad, precio_venta, pedido_id, producto_id)
            VALUES
                (@cantidad, @precio_venta, @pedido_id, @producto_id);

            -- Calcular el total del pedido
            SET @total = @total + (@cantidad * @precio_venta);

            SET @j = @j + 1;
        END

        -- Actualizar el total del pedido
        UPDATE pedido SET total = @total WHERE id = @pedido_id;

        -- Insertar una factura si el estado del pedido es 2 (Confirmado)
        IF @estado_pedido_id != 1
        BEGIN
            INSERT INTO factura
                (fecha_creacion, total, pedido_id, NIT, usuario_vendedor_id)
            VALUES
                (@fecha_factura_tmp, @total, @pedido_id, (SELECT NIT
                    FROM usuario
                    WHERE id = @usuario_id_tmp), FLOOR(RAND() * 2) + 11);
        END;

        SET @i = @i + 1;
    END;
END;
Go

DROP VIEW IF EXISTS v_productos_activos_stock_m0;
GO
CREATE VIEW v_productos_activos_stock_m0 AS
SELECT *
FROM producto
WHERE
    estado_producto_id = 1
    AND stock > 0;
GO

DROP VIEW IF EXISTS v_total_ingresos_agosto_pedidos;
GO
-- Crear la vista con un alias para la columna
CREATE VIEW v_total_ingresos_agosto_pedidos AS
SELECT SUM(total) AS total_ingresos
FROM pedido;
GO

DROP VIEW IF EXISTS v_mayores_clientes;
GO
CREATE VIEW v_mayores_clientes AS
SELECT u.id AS id_usuario, u.email, SUM(p.total) AS gasto_total
FROM pedido AS p
    LEFT JOIN usuario AS u ON u.id = p.usuario_id
WHERE
    p.fecha_confirmacion IS NOT NULL
GROUP BY
    u.email,
    u.id;
GO

DROP VIEW IF EXISTS v_productos_mas_vendidos;

GO
CREATE VIEW v_productos_mas_vendidos AS
SELECT dp.producto_id, p.nombre, SUM(dp.cantidad) AS cantidad_vendida
FROM
    detalle_pedido AS dp
    LEFT JOIN producto AS p ON p.id = dp.producto_id
GROUP BY
    dp.producto_id,
    p.nombre;
GO

-- Invocar el procedimiento almacenado
EXEC p_config_predefinidos 40, 5;

-- Habilita las salidas

-- TESTEO
-- EXEC p_cambiar_estado_producto 1, 2;
-- EXEC p_create_usuario 'a@example.com', 'EX NAME', 'EX NIT', 'EX PASS', 'EX NIT', '1990-01-01', 1, 3;
-- SELECT * FROM v_productos_activos_stock_m0;
-- SELECT * FROM v_total_ingresos_agosto_pedidos;
-- SELECT TOP 10 * FROM v_mayores_clientes ORDER BY gasto_total DESC;
-- SELECT TOP 10 * FROM v_productos_mas_vendidos ORDER BY cantidad_vendida DESC;

-- SELECT *
-- FROM sys.server_principals
-- WHERE type IN ('S', 'U', 'G')  -- 'S' = SQL login, 'U' = Windows login, 'G' = Windows group
--   AND name NOT LIKE '##%'       -- Excluye logins internos del sistema
-- ORDER BY name;

-- SELECT *
-- FROM sys.database_principals
-- WHERE type IN ('S', 'U')  -- 'S' = SQL user, 'U' = Windows user
--   AND name NOT LIKE '##%'  -- Excluye usuarios internos del sistema
-- ORDER BY name;