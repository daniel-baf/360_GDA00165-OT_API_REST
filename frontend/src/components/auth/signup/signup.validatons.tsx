import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de correo inválido")
    .required("El correo es obligatorio"),
  nombre_completo: yup.string().required("El nombre es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  telefono: yup
    .string()
    .matches(/^[0-9]{8,10}$/, "El teléfono debe tener entre 8 y 10 dígitos")
    .optional(),
  NIT: yup
    .string()
    .nullable()
    .matches(
      /^[A-Za-z0-9]*$/,
      "El NIT debe contener solo caracteres alfanuméricos"
    ),
  fecha_nacimiento: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "La fecha debe estar en el formato YYYY-MM-DD"
    )
    .test(
      "maxDate",
      "La fecha de nacimiento no puede ser en el futuro",
      (value) => {
        if (!value) return true;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      }
    )
    .required("La fecha de nacimiento es obligatoria")
    .typeError("Debes proporcionar una fecha válida"),
  terms: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones")
    .required(),
});
