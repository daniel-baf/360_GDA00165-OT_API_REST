import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField, Checkbox, Button } from "../../forms/Form";

interface SignUpProps {
  switchToSignIn: () => void; // Callback to switch to the SignIn view
}

type SignUpFormData = {
  email: string;
  nombre_completo: string;
  password: string;
  telefono?: string;
  NIT?: string | null;
  fecha_nacimiento: string; // Cambiado a string porque React Hook Form no maneja Date directamente
  terms: boolean;
};

// Esquema de validación con Yup
const signUpSchema = yup.object().shape({
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
        today.setHours(0, 0, 0, 0); // Asegura que solo se compare la fecha sin la hora
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

const SignUp: React.FC<SignUpProps> = ({ switchToSignIn }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema), // Conecta Yup con React Hook Form
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    console.log("Form Data:", data);
    // TODO: Enviar datos a la API
  };

  return (
    <div className="p-6 space-y-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          id="email_id"
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="correo@dominio.com"
          registration={register("email")}
          error={errors.email}
        />
        <InputField
          id="nombre_completo_id"
          name="nombre_completo"
          label="Nombre Completo"
          type="text"
          placeholder="Juan Perez"
          registration={register("nombre_completo")}
          error={errors.nombre_completo}
        />
        <InputField
          id="password_id"
          name="password"
          label="Contraseña"
          type="password"
          placeholder="********"
          registration={register("password")}
          error={errors.password}
        />
        <div className="flex space-x-4">
          <InputField
            id="telefono_id"
            name="telefono"
            label="Teléfono"
            type="tel"
            placeholder="12345678"
            registration={register("telefono")}
            error={errors.telefono}
          />
          <InputField
            id="NIT_id"
            name="NIT"
            label="NIT"
            type="text"
            placeholder="111123a"
            registration={register("NIT")}
            error={errors.NIT}
          />
        </div>
        <InputField
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          placeholder="dd/mm/aaaa"
          registration={register("fecha_nacimiento")}
          error={errors.fecha_nacimiento}
        />
        <Checkbox
          id="terms"
          label="Acepto los términos y condiciones"
          registration={register("terms")}
          error={errors.terms}
        />
        <Button type="submit" label="Crear cuenta" />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            onClick={(e) => {
              e.preventDefault();
              switchToSignIn();
            }}
          >
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
