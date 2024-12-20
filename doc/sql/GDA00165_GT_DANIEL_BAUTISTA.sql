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
-- LOS PROCEDIMIENTOS SOLICITADOS SE LLAMAN p_cambiar_estado_producto y  p_insertar_usuario
-- Las vistas se llaman v_productos_activos_stock_m0, v_total_ingresos_agosto_pedidos v_mayores_clientes
USE master;
GO
-- Eliminar la base de datos si existe y usuario por defecto
DROP DATABASE IF EXISTS [GDA00165_GT_DANIEL_BAUTISTA];
DROP USER IF EXISTS [GDA00165_GT_USER];
-- Eliminar el login del servidor
IF EXISTS (SELECT *
FROM sys.server_principals
WHERE name = 'GDA00165_GT')
	DROP LOGIN GDA00165_GT;
GO
-- Crear la base de datos dinámicamente
CREATE DATABASE [GDA00165_GT_DANIEL_BAUTISTA];
CREATE LOGIN GDA00165_GT WITH PASSWORD = 'Contrase@nalg_dag123as511';
-- Usar la base de datos dinámicamente
GO
USE [GDA00165_GT_DANIEL_BAUTISTA];
CREATE USER GDA00165_GT_USER FOR LOGIN GDA00165_GT;
ALTER ROLE db_owner ADD MEMBER [GDA00165_GT_USER];
GO


-- TABLA USADA PARA ALMACENAR LOS ROLES DE LOS usuarioS Y DAR ACCESO A DISTINTAS VISTAS
DROP TABLE IF EXISTS rol;
CREATE TABLE rol
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
);

-- ESTA TABLA SIRVE PARA INHABILITAR usuarioS Y NO DARLE ACCESO... A FUTURO PODRIA USARSE PARA MAS TIPOS DE ESTADOS
DROP TABLE IF EXISTS estado_usuario;
CREATE TABLE estado_usuario
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
);

-- TABLA USADA PARA ALMACENAR LOS ESTADOS DE LOS pedidoS, ENTREGADA...
DROP TABLE IF EXISTS estado_pedido;
CREATE TABLE estado_pedido
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
);

-- ALMACENA A TODOS LOS usuarioS DLE SISTEMA, TANTO OPERARIOS COMO CONSUMIDORES
DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario
(
    id INT PRIMARY KEY IDENTITY,
    email VARCHAR(50) NOT NULL UNIQUE,
    nombre_completo VARCHAR(50) NOT NULL,
    NIT VARCHAR(15) NOT NULL DEFAULT 'CF',
    password VARCHAR(75) NOT NULL,
    telefono VARCHAR(10),
    fecha_nacimiento DATE NOT NULL,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE(),
    rol_id INT FOREIGN KEY REFERENCES Rol(id),
    estado_usuario_id INT FOREIGN KEY REFERENCES estado_usuario(id),
);

-- UNA PERSONA PUEDE TENER VARIAS DIRECCIONES DE ENTREGA O NINGUNA, POR ESTO ES RELACION 1:0...*
-- SE DEBE VALIDAR QUE LAS DIRECCIONES DE ENTREGA SE ALMACENEN UNICAMENTE PARA LOS DEL ROL CLIENTE
DROP TABLE IF EXISTS direccion_cliente;
CREATE TABLE direccion_cliente
(
    id INT PRIMARY KEY IDENTITY,
    departamento VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(10),
    usuario_id INT FOREIGN KEY REFERENCES usuario(id) NOT NULL,
);

-- TABLA USADA PARA CATEGORIZAR LOS productoS Y FACILITAR LA BUSQUEDA
DROP TABLE IF EXISTS categoria_producto;
CREATE TABLE categoria_producto
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
);

-- TABLA DE ESTADOS DE productoS, HABILITADO O DESHABILITADO...
DROP TABLE IF EXISTS estado_producto;
CREATE TABLE estado_producto
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
);

-- TABLA USADA PARA ALMACENAR LOS productoS QUE SE VENDEN
DROP TABLE IF EXISTS producto;
CREATE TABLE producto
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(245),
    precio DECIMAL(10, 2) NOT NULL,
    precio_mayorista DECIMAL(10, 2),
    stock INT NOT NULL,
    estado_producto_id INT FOREIGN KEY REFERENCES estado_producto(id) NOT NULL DEFAULT 1,
    -- por defecto el producto nuevo se habilitara
    categoria_producto_id INT FOREIGN KEY REFERENCES categoria_producto(id),
);

-- TABLA USADA PARA SERVIR COMO CONTENIDO DE UN pedido Y factura
DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedido;

CREATE TABLE pedido
(
    id INT PRIMARY KEY IDENTITY,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE(),
    fecha_confirmacion DATE DEFAULT NULL,
    fecha_entrega DATE DEFAULT NULL,
    total DECIMAL(10, 2) NOT NULL,
    usuario_validador_id INT FOREIGN KEY REFERENCES usuario(id) DEFAULT NULL,
    -- PERSONA QUE DIO COMO VALIDO EL pedido
    usuario_id INT FOREIGN KEY REFERENCES usuario(id) NOT NULL,
    direccion_entrega_id INT FOREIGN KEY REFERENCES direccion_cliente(id) NOT NULL,
    estado_pedido_id INT FOREIGN KEY REFERENCES estado_pedido(id) NOT NULL DEFAULT 1,
);

-- TABLA USADA PARA ALMACENAR EL CONTENIDO DE UN pedido
CREATE TABLE detalle_pedido
(
    id INT PRIMARY KEY IDENTITY,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    -- EL SUBTOTAL NO LO ALMACENO PORQUE SE PUEDE CALCULAR CON CANTIDAD * PRECIO_VENTA, ES UN ATRIBUTO DERIVADO
    pedido_id INT FOREIGN KEY REFERENCES pedido(id) NOT NULL,
    producto_id INT FOREIGN KEY REFERENCES producto(id) NOT NULL,
);

-- TABLA USADA PARA ALMACENAR LAS facturaS GENERADAS POR LOS pedidoS
DROP TABLE IF EXISTS factura;
CREATE TABLE factura
(
    id INT PRIMARY KEY IDENTITY,
    fecha_creacion DATE NOT NULL DEFAULT GETDATE(),
    total DECIMAL(10, 2) NOT NULL,
    NIT VARCHAR(15) NOT NULL DEFAULT 'CF',
    pedido_id INT FOREIGN KEY REFERENCES pedido(id) NOT NULL,
    usuario_vendedor_id INT FOREIGN KEY REFERENCES usuario(id) NOT NULL,
);

-- TABLA DE configuracionES PARA REUTILIZAR EL SOFTWARE EN CASO DE SER NECESARIO
DROP TABLE IF EXISTS configuracion;
CREATE TABLE configuracion
(
    id INT PRIMARY KEY IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    valor VARCHAR(245) NOT NULL,
);


GO
DROP PROCEDURE IF EXISTS p_create_rol;
DROP PROCEDURE IF EXISTS p_list_rol;
DROP PROCEDURE IF EXISTS p_update_rol;
DROP PROCEDURE IF EXISTS p_delete_rol;
GO

-- Procedimiento para crear un nuevo rol
CREATE OR ALTER PROCEDURE p_create_rol
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    INSERT INTO rol
        (nombre, descripcion)
    VALUES
        (@nombre, @descripcion);
END;
GO

-- Procedimiento para actualizar un rol existente
CREATE OR ALTER PROCEDURE p_update_rol
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    UPDATE rol
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id = @id;
END;
GO

-- Procedimiento para listar todos los roles con paginación
CREATE OR ALTER PROCEDURE p_list_rol
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion
        FROM rol
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion
        FROM rol;
    END
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
        (@nombre, @descripcion);
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
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id = @id;
END;
GO

-- Procedimiento para listar todos los estados de usuario con paginación
CREATE OR ALTER PROCEDURE p_list_estado_usuario
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_usuario
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_usuario;
    END
END;
GO

-- procedimiento para eliminar los estados de usuario
CREATE OR ALTER PROCEDURE p_delete_estado_usuario
    @id INT = NULL
AS
BEGIN
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
    INSERT INTO estado_pedido
        (nombre, descripcion)
    VALUES
        (@nombre, @descripcion);
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
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id = @id;
END;
GO

-- Procedimiento para listar todos los estados de pedido con paginación
CREATE OR ALTER PROCEDURE p_list_estado_pedido
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_pedido
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion
        FROM estado_pedido;
    END
END;
GO

-- procedimiento para eliminar los estados de pedido
CREATE OR ALTER PROCEDURE p_delete_estado_pedido
    @id INT = NULL
AS
BEGIN
    DELETE FROM estado_pedido WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_insertar_usuario;
DROP PROCEDURE IF EXISTS p_listar_usuarios;
DROP PROCEDURE IF EXISTS p_update_usuario;
DROP PROCEDURE IF EXISTS p_delete_usuario;
GO


-- PROCEDIMIENTO ALMACENADO PARA INSERTAR usuarioS EN LA BASE DE DATOS
CREATE OR ALTER PROCEDURE p_insertar_usuario
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
    @rol_id INT,
    @estado_usuario_id INT
AS
BEGIN
    UPDATE usuario
    SET email = @email,
        nombre_completo = @nombre_completo,
        NIT = @NIT,
        password = @password,
        telefono = @telefono,
        fecha_nacimiento = @fecha_nacimiento,
        rol_id = @rol_id,
        estado_usuario_id = @estado_usuario_id
    WHERE id = @id;
END;
GO

-- Procedimiento para eliminar un usuario por ID
CREATE OR ALTER PROCEDURE p_delete_usuario
    @id INT
AS
BEGIN
    DELETE FROM usuario
    WHERE id = @id;
END;
GO

-- Procedimiento para listar usuarios con paginación
CREATE OR ALTER PROCEDURE p_list_usuario
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id
        FROM usuario
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id
        FROM usuario;
    END
END;
GO

-- Procedimiento para buscar un usuario por ID
CREATE OR ALTER PROCEDURE p_search_usuario
    @id INT
AS
BEGIN
    SELECT id, email, nombre_completo, NIT, telefono, fecha_nacimiento, fecha_creacion, rol_id, estado_usuario_id
    FROM usuario
    WHERE id = @id;
END;

GO
DROP PROCEDURE IF EXISTS p_create_direccion_cliente;
DROP PROCEDURE IF EXISTS p_list_direccion_cliente;
DROP PROCEDURE IF EXISTS p_update_direccion_cliente;
DROP PROCEDURE IF EXISTS p_delete_direccion_cliente;
GO

CREATE OR ALTER PROCEDURE p_create_direccion_cliente
    @departamento VARCHAR(50),
    @municipio VARCHAR(50),
    @direccion VARCHAR(100),
    @telefono VARCHAR(10),
    @usuario_id INT
AS
BEGIN
    INSERT INTO direccion_cliente
        (departamento, municipio, direccion, telefono, usuario_id)
    VALUES
        (@departamento, @municipio, @direccion, @telefono, @usuario_id);
END;
GO

CREATE OR ALTER PROCEDURE p_update_direccion_cliente
    @id INT,
    @departamento VARCHAR(50),
    @municipio VARCHAR(50),
    @direccion VARCHAR(100),
    @telefono VARCHAR(10),
    @usuario_id INT
AS
BEGIN
    UPDATE direccion_cliente
    SET departamento = @departamento,
        municipio = @municipio,
        direccion = @direccion,
        telefono = @telefono,
        usuario_id = @usuario_id
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
    @usuario_id INT
AS
BEGIN
    SELECT id, departamento, municipio, direccion, telefono, usuario_id
    FROM direccion_cliente
    WHERE usuario_id = @usuario_id;
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
END;
GO

CREATE OR ALTER PROCEDURE p_update_categoria_producto
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    UPDATE categoria_producto
    SET nombre = @nombre,
        descripcion = @descripcion
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
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion
        FROM categoria_producto
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion
        FROM categoria_producto;
    END
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
    INSERT INTO estado_producto
        (nombre, descripcion)
    VALUES
        (@nombre, @descripcion);
END;
GO

CREATE OR ALTER PROCEDURE p_update_estado_producto
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245)
AS
BEGIN
    UPDATE estado_producto
    SET nombre = @nombre,
        descripcion = @descripcion
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_delete_estado_producto
    @id INT
AS
BEGIN
    DELETE FROM estado_producto
    WHERE id = @id;
END;
GO

CREATE OR ALTER PROCEDURE p_list_estado_producto
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
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
        FROM estado_producto;
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
    INSERT INTO producto
        (nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id)
    VALUES
        (@nombre, @descripcion, @precio, @precio_mayorista, @stock, @estado_producto_id, @categoria_producto_id);
END;
GO


CREATE OR ALTER PROCEDURE p_update_producto
    @id INT,
    @nombre VARCHAR(50),
    @descripcion VARCHAR(245),
    @precio DECIMAL(10, 2),
    @precio_mayorista DECIMAL(10, 2) = NULL,
    @stock INT,
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

    IF @precio_mayorista IS NOT NULL AND @precio_mayorista > @precio
    BEGIN
        RAISERROR ('El precio mayorista no puede ser mayor al precio de venta.', 16, 1);
        RETURN;
    END;


    UPDATE producto
    SET nombre = @nombre,
        descripcion = @descripcion,
        precio = @precio,
        precio_mayorista = @precio_mayorista,
        stock = @stock,
        estado_producto_id = @estado_producto_id,
        categoria_producto_id = @categoria_producto_id
    WHERE id = @id;
END;
GO


CREATE OR ALTER PROCEDURE p_delete_producto
    @id INT
AS
BEGIN
    DELETE FROM producto
    WHERE id = @id;
END;
GO


CREATE OR ALTER PROCEDURE p_list_producto
    @limit INT = NULL,
    @offset INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id
        FROM producto
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id
        FROM producto;
    END
END;
GO

CREATE OR ALTER PROCEDURE p_get_producto
    @id INT
AS
BEGIN
    SELECT id, nombre, descripcion, precio, precio_mayorista, stock, estado_producto_id, categoria_producto_id
    FROM producto
    WHERE id = @id;
END;


GO
DROP PROCEDURE IF EXISTS p_create_detalle_pedido;
DROP PROCEDURE IF EXISTS p_listar_detalles_pedido;
DROP PROCEDURE IF EXISTS p_update_detalle_pedido;
DROP PROCEDURE IF EXISTS p_delete_detalle_pedido;
DROP PROCEDURE IF EXISTS p_create_pedido;
DROP PROCEDURE IF EXISTS p_list_pedido;
DROP PROCEDURE IF EXISTS p_delete_pedido;
GO

CREATE OR ALTER PROCEDURE p_listar_detalles_pedido
    @pedido_id INT
AS
BEGIN
    -- Seleccionar todos los detalles del pedido especificado por @pedido_id
    SELECT
        dp.id AS detalle_id,
        dp.cantidad,
        dp.precio_venta,
        (dp.cantidad * dp.precio_venta) AS subtotal, -- Subtotal calculado
        dp.producto_id,
        p.nombre AS producto_nombre
    -- Suponiendo que tienes una columna 'nombre' en la tabla producto
    FROM
        detalle_pedido dp
        JOIN
        producto p ON dp.producto_id = p.id
    WHERE 
        dp.pedido_id = @pedido_id;
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
    -- ID del usuario que valida el pedido
    @direccion_entrega_id INT,
    -- ID de la dirección de entrega
    @estado_pedido_id INT,
    -- Estado del pedido
    @json_detalles NVARCHAR(MAX)
-- JSON que contiene los detalles del pedido
AS
BEGIN
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

        -- Procesar el JSON y extraer los detalles
        DECLARE @Detalles TABLE (
        producto_id INT,
        cantidad INT,
        precio_venta DECIMAL(10, 2)
        );

        -- Insertar los detalles desde el JSON en la tabla temporal
        INSERT INTO @Detalles
        (producto_id, cantidad, precio_venta)
    SELECT
        JSON_VALUE(value, '$.producto_id') AS producto_id,
        JSON_VALUE(value, '$.cantidad') AS cantidad,
        JSON_VALUE(value, '$.precio_venta') AS precio_venta
    FROM OPENJSON(@json_detalles, '$.productos');

        -- Insertar los detalles en la tabla detalle_pedido y calcular el total
        DECLARE detalle_cursor CURSOR FOR
            SELECT producto_id, cantidad, precio_venta
    FROM @Detalles;

        OPEN detalle_cursor;
        FETCH NEXT FROM detalle_cursor INTO @producto_id, @cantidad, @precio_venta;

        -- Iterar sobre cada detalle y sumarlo al total
        WHILE @@FETCH_STATUS = 0
        BEGIN
        -- Llamar al procedimiento p_create_detalle_pedido para insertar cada detalle, pasando el @pedido_id
        EXEC p_create_detalle_pedido @cantidad, @precio_venta, @pedido_id, @producto_id;

        -- Calcular el total (sumar cantidad * precio_venta)
        SET @total = @total + (@cantidad * @precio_venta);

        FETCH NEXT FROM detalle_cursor INTO @producto_id, @cantidad, @precio_venta;
    END

        CLOSE detalle_cursor;
        DEALLOCATE detalle_cursor;

        -- Actualizar el total del pedido
        UPDATE pedido
        SET total = @total
        WHERE id = @pedido_id;

        -- Si todo salió bien, hacer commit
        COMMIT TRANSACTION;

        -- Retornar el ID del pedido creado
        SELECT @pedido_id AS pedido_id;

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
    @target_state INT = NULL
AS
BEGIN
    IF @limit IS NOT NULL AND @offset IS NOT NULL
    BEGIN
        SELECT id, fecha_creacion, fecha_confirmacion, fecha_entrega, total,
            usuario_validador_id, usuario_id, direccion_entrega_id, estado_pedido_id
        FROM pedido
        WHERE (@target_state IS NULL OR estado_pedido_id = @target_state)
        ORDER BY id
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
    END
    ELSE
    BEGIN
        SELECT id, fecha_creacion, fecha_confirmacion, fecha_entrega, total,
            usuario_validador_id, usuario_id, direccion_entrega_id, estado_pedido_id
        FROM pedido
        WHERE (@target_state IS NULL OR estado_pedido_id = @target_state);
    END
END;
GO

CREATE OR ALTER PROCEDURE p_delete_pedido
    @id INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Verificar si el estado del pedido es 1
        IF EXISTS (SELECT 1
    FROM pedido
    WHERE id = @id AND estado_pedido_id = 1)
        BEGIN
        -- Obtener todos los detalles de este pedido
        DECLARE @detalle_id INT;

        DECLARE detalle_cursor CURSOR FOR
                SELECT id
        FROM detalle_pedido
        WHERE pedido_id = @id;

        OPEN detalle_cursor;
        FETCH NEXT FROM detalle_cursor INTO @detalle_id;

        -- Iterar sobre cada detalle del pedido
        WHILE @@FETCH_STATUS = 0
            BEGIN
            -- Llamar al procedimiento para borrar el detalle
            EXEC p_delete_detalle_pedido @detalle_id;

            FETCH NEXT FROM detalle_cursor INTO @detalle_id;
        END

        CLOSE detalle_cursor;
        DEALLOCATE detalle_cursor;

        -- Eliminar el pedido si todo salió bien
        DELETE FROM pedido WHERE id = @id;
    END
        ELSE
        BEGIN
        -- Si el estado no es 1, no se puede eliminar el pedido
        PRINT 'No se puede eliminar el pedido, el estado no es 1.';
    END

        -- Si todo se ha ejecutado correctamente, hacer commit
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- En caso de error, hacer rollback
        ROLLBACK TRANSACTION;

        -- Opcionalmente, puedes manejar el error o lanzar una excepción
        PRINT 'Se ha producido un error y la transacción ha sido revertida.';
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
    DECLARE @usuario_id INT,
            @rol_id INT;

    -- Iteramos sobre todas las filas de la tabla inserted (en caso de que se inserten varias filas a la vez)
    DECLARE usuario_cursor CURSOR FOR
        SELECT usuario_id
    FROM inserted;

    OPEN usuario_cursor;

    FETCH NEXT FROM usuario_cursor INTO @usuario_id;

    -- Recorremos todas las filas
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Obtenemos el rol del usuario
        SELECT @rol_id = rol_id
        FROM usuario
        WHERE id = @usuario_id;

        -- Verificamos si el rol es diferente de 1 (Cliente)
        IF @rol_id != 1
        BEGIN
            RAISERROR ('Solo los usuarios con rol de Cliente pueden tener direcciones de entrega.', 16, 1);
            CLOSE usuario_cursor;
            DEALLOCATE usuario_cursor;
            RETURN;
        END;

        FETCH NEXT FROM usuario_cursor INTO @usuario_id;
    END

    CLOSE usuario_cursor;
    DEALLOCATE usuario_cursor;

    -- Si todos los usuarios tienen rol 1, realizamos la inserción en la tabla direccion_cliente
    INSERT INTO direccion_cliente
        (departamento, municipio, direccion, telefono, usuario_id)
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
    EXEC p_insertar_usuario 'cliente1@example.com', 'Cliente Uno', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567890', '1990-01-01', 1, 3;
    EXEC p_insertar_usuario 'cliente2@example.com', 'Cliente Dos', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567891', '1991-02-02', 1, 3;
    EXEC p_insertar_usuario 'cliente3@example.com', 'Cliente Tres', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567892', '1992-03-03', 1, 3;
    EXEC p_insertar_usuario 'cliente4@example.com', 'Cliente Cuatro', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567893', '1993-04-04', 1, 3;
    EXEC p_insertar_usuario 'cliente5@example.com', 'Cliente Cinco', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567894', '1994-05-05', 1, 3;
    EXEC p_insertar_usuario 'cliente6@example.com', 'Cliente Seis', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567895', '1995-06-06', 1, 3;
    EXEC p_insertar_usuario 'cliente7@example.com', 'Cliente Siete', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567896', '1996-07-07', 1, 3;
    EXEC p_insertar_usuario 'cliente8@example.com', 'Cliente Ocho', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567897', '1997-08-08', 1, 3;
    EXEC p_insertar_usuario 'cliente9@example.com', 'Cliente Nueve', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567898', '1998-09-09', 1, 3;
    EXEC p_insertar_usuario 'cliente10@example.com', 'Cliente Diez', 'CF', '$2a$10$c5y8g40AqPFO06ot8Iwli.6mMBddh6AreKD3mzMX0LFKbomf8Ag6q', '1234567899', '1999-10-10', 1, 3;
    -- INSERTS PARA usuarioS OPERATIVOS
    EXEC p_insertar_usuario 'operativo1@example.com', 'Operativo Uno', 'CF', 'password12', '0987654322', '1981-02-02', 2, 3;
    EXEC p_insertar_usuario 'operativo2@example.com', 'Operativo Dos', 'CF', 'password12', '0987654322', '1981-02-02', 2, 3;

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

    -- INSERTS PARA productoS
    INSERT INTO producto
        (nombre, descripcion, precio, precio_mayorista, stock, categoria_producto_id)
    VALUES
        ('Pan', 'Pan fresco', 1.00, 0.90, FLOOR(RAND() * 41), 1),
        ('Leche', 'Leche entera', 1.50, 1.30, FLOOR(RAND() * 41), 1),
        ('Huevos', 'Docena de huevos', 2.00, 1.80, FLOOR(RAND() * 41), 1),
        ('Arroz', 'Arroz blanco', 1.20, 1.00, FLOOR(RAND() * 41), 1),
        ('Frijoles', 'Frijoles negros', 1.30, 1.10, FLOOR(RAND() * 41), 1),
        ('Jugo de Naranja', 'Jugo de naranja natural', 2.00, 1.80, FLOOR(RAND() * 41), 2),
        ('Refresco', 'Refresco de cola', 1.00, 0.90, FLOOR(RAND() * 41), 2),
        ('Agua', 'Agua embotellada', 0.80, 0.70, FLOOR(RAND() * 41), 2),
        ('Cerveza', 'Cerveza rubia', 1.50, 1.30, FLOOR(RAND() * 41), 2),
        ('Vino', 'Vino tinto', 10.00, 9.00, FLOOR(RAND() * 41), 2),
        ('Detergente', 'Detergente en polvo', 3.00, 2.70, FLOOR(RAND() * 41), 3),
        ('Jabón', 'Jabón de barra', 0.50, 0.40, FLOOR(RAND() * 41), 3),
        ('Cloro', 'Cloro desinfectante', 1.00, 0.90, FLOOR(RAND() * 41), 3),
        ('Suavizante', 'Suavizante de ropa', 2.00, 1.80, FLOOR(RAND() * 41), 3),
        ('Escoba', 'Escoba de cerdas', 2.50, 2.20, FLOOR(RAND() * 41), 3),
        ('Shampoo', 'Shampoo para cabello', 3.00, 2.70, FLOOR(RAND() * 41), 4),
        ('Pasta Dental', 'Pasta dental con flúor', 1.50, 1.30, FLOOR(RAND() * 41), 4),
        ('Jabón Líquido', 'Jabón líquido para manos', 2.00, 1.80, FLOOR(RAND() * 41), 4),
        ('Desodorante', 'Desodorante en barra', 2.50, 2.20, FLOOR(RAND() * 41), 4),
        ('Papel Higiénico', 'Papel higiénico de 4 rollos', 3.00, 2.70, FLOOR(RAND() * 41), 4),
        ('Cuaderno', 'Cuaderno de 100 hojas', 1.00, 0.90, FLOOR(RAND() * 41), 5),
        ('Lápiz', 'Lápiz de grafito', 0.20, 0.15, FLOOR(RAND() * 41), 5),
        ('Bolígrafo', 'Bolígrafo de tinta azul', 0.50, 0.40, FLOOR(RAND() * 41), 5),
        ('Resaltador', 'Resaltador amarillo', 0.80, 0.70, FLOOR(RAND() * 41), 5),
        ('Carpeta', 'Carpeta de anillas', 2.00, 1.80, FLOOR(RAND() * 41), 5),
        ('Tijeras', 'Tijeras de oficina', 1.50, 1.30, FLOOR(RAND() * 41), 5),
        ('Goma de Borrar', 'Goma de borrar blanca', 0.30, 0.25, FLOOR(RAND() * 41), 5),
        ('Pegamento', 'Pegamento en barra', 0.70, 0.60, FLOOR(RAND() * 41), 5),
        ('Regla', 'Regla de 30 cm', 0.50, 0.40, FLOOR(RAND() * 41), 5),
        ('Marcador', 'Marcador permanente', 1.00, 0.90, FLOOR(RAND() * 41), 5),
        ('Cereal', 'Cereal de maíz', 2.50, 2.20, FLOOR(RAND() * 41), 1),
        ('Yogurt', 'Yogurt natural', 1.20, 1.00, FLOOR(RAND() * 41), 1),
        ('Galletas', 'Galletas de chocolate', 1.50, 1.30, FLOOR(RAND() * 41), 1),
        ('Aceite', 'Aceite vegetal', 2.00, 1.80, FLOOR(RAND() * 41), 1),
        ('Mantequilla', 'Mantequilla sin sal', 1.50, 1.30, FLOOR(RAND() * 41), 1),
        ('Té', 'Té verde', 1.00, 0.90, FLOOR(RAND() * 41), 2),
        ('Café', 'Café molido', 3.00, 2.70, FLOOR(RAND() * 41), 2),
        ('Champú', 'Champú anticaspa', 3.50, 3.20, FLOOR(RAND() * 41), 4),
        ('Crema Corporal', 'Crema hidratante', 2.50, 2.20, FLOOR(RAND() * 41), 4),
        ('Toallas', 'Toallas de papel', 1.50, 1.30, FLOOR(RAND() * 41), 4);

    -- INSERTAMOS DATOS USADOS PARA CONFIGURAR EL SISTEMA
    INSERT INTO configuracion
        (nombre, valor)
    VALUES
        ('IVA', '12'),
        ('CANTIDAD_MAYORISTAS', '12'),
        ('NOMBRE_APLICACION', 'Mi Tienda Online');

    DECLARE @i INT = 1;
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
        SET @estado_pedido_id = CASE WHEN @num_no_confirmados < @i THEN 2 ELSE 1 END;
        SET @usuario_id_tmp = FLOOR(RAND() * 10) + 1;
        SET @fecha_creacion_tmp = DATEADD(DAY, -FLOOR(RAND() * 730), GETDATE());
        SET @fecha_factura_tmp = DATEADD(DAY, FLOOR(RAND() * 4) + 1, @fecha_creacion_tmp);
        -- Insertar el pedido
        INSERT INTO pedido
            (fecha_creacion, fecha_confirmacion, fecha_entrega, total, usuario_id, direccion_entrega_id, estado_pedido_id, usuario_validador_id)
        VALUES
            (
                @fecha_creacion_tmp,
                CASE WHEN @estado_pedido_id = 2 THEN DATEADD(DAY, 1, @fecha_creacion_tmp) ELSE NULL END,
                CASE WHEN @estado_pedido_id = 2 THEN @fecha_factura_tmp ELSE NULL END,
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
            SET @producto_id = FLOOR(RAND() * 40) + 1;
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
        IF @estado_pedido_id = 2
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
CREATE VIEW v_productos_activos_stock_m0
AS
    SELECT *
    FROM producto
    WHERE estado_producto_id = 1 AND stock > 0;
GO


DROP VIEW IF EXISTS v_total_ingresos_agosto_pedidos;
GO
-- Crear la vista con un alias para la columna
CREATE VIEW v_total_ingresos_agosto_pedidos
AS
    SELECT SUM(total) AS total_ingresos
    FROM pedido;
GO

DROP VIEW IF EXISTS v_mayores_clientes;
GO
CREATE VIEW v_mayores_clientes
AS
    SELECT u.id AS id_usuario, u.email, SUM(p.total) AS gasto_total
    FROM pedido AS p
        LEFT JOIN usuario AS u
        ON u.id = p.usuario_id
    WHERE p.fecha_confirmacion IS NOT NULL
    GROUP BY u.email, u.id;
GO


DROP VIEW IF EXISTS v_productos_mas_vendidos;

GO
CREATE VIEW v_productos_mas_vendidos
AS
    SELECT dp.producto_id, p.nombre, SUM(dp.cantidad) AS cantidad_vendida
    FROM detalle_pedido AS dp
        LEFT JOIN producto AS p
        ON p.id = dp.producto_id
    GROUP BY dp.producto_id, p.nombre;
GO

-- Invocar el procedimiento almacenado
EXEC p_config_predefinidos 15, 5;


-- TESTEO
-- EXEC p_cambiar_estado_producto 1, 2;
-- EXEC p_insertar_usuario 'a@example.com', 'EX NAME', 'EX NIT', 'EX PASS', 'EX NIT', '1990-01-01', 1, 3;
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