import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField, Checkbox, Button } from "../../forms/Form";

interface SignInProps {
  switchToSignUp: () => void; // Callback to switch to the SignUp view
}

type SignInFormData = {
  email: string;
  password: string;
  remember?: boolean; // Cambiado a opcional para que coincida con Yup
};

// Esquema de validación con Yup
const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de correo inválido")
    .required("El correo es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  remember: yup.boolean(), // Es opcional por defecto
});

const SignIn: React.FC<SignInProps> = ({ switchToSignUp }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema), // Conecta Yup con React Hook Form
  });

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    console.log("Form Data:", data);
    // TODO: Enviar datos a la API
  };

  return (
    <div className="p-6 space-y-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          id="email"
          name="email"
          label="Tu correo electrónico"
          type="email"
          placeholder="mail@domain.com"
          registration={register("email")} // Conecta React Hook Form
          error={errors.email} // Muestra errores de validación
        />
        <InputField
          id="password"
          name="password"
          label="Tu contraseña"
          type="password"
          placeholder="••••••••"
          registration={register("password")}
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <Checkbox
            id="remember"
            label="Recordarme"
            registration={register("remember")}
            error={errors.remember}
          />
          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Olvidé mi contraseña
          </a>
        </div>
        <Button type="submit" label="Iniciar sesión" />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Evita la navegación por defecto
              switchToSignUp(); // Cambia a la vista de registro
            }}
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Crear cuenta
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
