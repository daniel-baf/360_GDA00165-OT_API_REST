import { InputField, Checkbox, Button } from "../../forms/Form";

interface SignInProps {
  switchToSignUp: () => void; // Callback to switch to the SignUp view
}

const SignIn: React.FC<SignInProps> = ({ switchToSignUp }) => {
  return (
    <div className="p-6 space-y-6 sm:p-8">
      <form className="space-y-6" action="#">
        <InputField
          id="email"
          name="email"
          label="Tu correo electrónico"
          type="email"
          placeholder="mail@domain.com"
          required
        />
        <InputField
          id="password"
          name="password"
          label="Tu contraseña"
          type="password"
          placeholder="••••••••"
          required
        />
        <div className="flex items-center justify-between">
          <Checkbox id="remember" label="Recordarme" required />
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
              e.preventDefault(); // Prevent default navigation behavior
              switchToSignUp(); // Call the parent function to switch views
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
