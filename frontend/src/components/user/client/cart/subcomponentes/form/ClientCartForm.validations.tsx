import * as Yup from "yup";

const newOrderSchema = Yup.object({
  direccion: Yup.object({
    id: Yup.number().required("El ID de la dirección es obligatorio"),
    departamento: Yup.string().required("El departamento es obligatorio"),
    municipio: Yup.string().required("El municipio es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    telefono: Yup.string().required("El teléfono es obligatorio"),
    usuario_id: Yup.number().required("El ID del usuario es obligatorio"),
  }).required("La dirección es obligatoria"),

  products: Yup.array()
    .of(
      Yup.object({
        product: Yup.object({
          id: Yup.number().required("El ID del producto es obligatorio"),
          nombre: Yup.string().required(
            "El nombre del producto es obligatorio"
          ),
          descripcion: Yup.string().required(
            "La descripción del producto es obligatoria"
          ),
          precio: Yup.number()
            .required("El precio del producto es obligatorio")
            .positive("El precio debe ser positivo"),
          precio_mayorista: Yup.number()
            .required("El precio mayorista es obligatorio")
            .positive("El precio mayorista debe ser positivo"),
          stock: Yup.number()
            .required("El stock es obligatorio")
            .min(0, "El stock no puede ser negativo"),
          estado_producto_id: Yup.number().required(
            "El estado del producto es obligatorio"
          ),
          categoria_producto_id: Yup.number().required(
            "La categoría del producto es obligatoria"
          ),
          categoria_nombre: Yup.string().required(
            "El nombre de la categoría es obligatorio"
          ),
          estado_nombre: Yup.string().required(
            "El nombre del estado es obligatorio"
          ),
          categoria_descripcion: Yup.string().required(
            "La descripción de la categoría es obligatoria"
          ),
        }).required("El producto es obligatorio"),

        quantity: Yup.number()
          .required("La cantidad es obligatoria")
          .min(1, "La cantidad debe ser al menos 1"),
      })
    )
    .required("Los productos son obligatorios")
    .min(1, "Debe haber al menos un producto"),
});

export { newOrderSchema };
