import { InputField, Checkbox, Button } from "../../forms/Form";

interface SignUpProps {
  switchToSignIn: () => void; // Callback to switch to the SignIn view
}

const SignUp: React.FC<SignUpProps> = ({ switchToSignIn }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="p-6 space-y-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="email_id"
          name="email"
          label="Correo Electrónico"
          type="email"
          placeholder="correo@dominio.com"
          required
        />
        <InputField
          id="nombre_completo_id"
          name="nombre_completo"
          label="Nombre Completo"
          type="text"
          placeholder="Juan Perez"
          required
        />
        <InputField
          id="password_id"
          name="password"
          label="Contraseña"
          type="password"
          placeholder="********"
          required
        />
        <div className="flex space-x-4">
          <InputField
            id="telefono_id"
            name="telefono"
            label="Teléfono"
            type="tel"
            placeholder="12345678"
          />
          <InputField
            id="NIT_id"
            name="NIT"
            label="NIT"
            type="text"
            placeholder="111123a"
          />
        </div>
        <InputField
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          label="Fecha de Nacimiento"
          type="date"
          placeholder="dd/mm/aaaa"
        />
        <Checkbox id="terms" label="Acepto los términos y condiciones" />
        <Button type="submit" label="Crear cuenta" />

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            onClick={(e) => {
              e.preventDefault(); // Prevent default navigation behavior
              switchToSignIn(); // Call the parent function to switch views
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
