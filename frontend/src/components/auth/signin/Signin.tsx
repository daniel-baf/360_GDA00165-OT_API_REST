import { useContext } from "react";
import { SignInForm } from "./signin.form";
import { SubmitHandler } from "react-hook-form";
import { getTokenDecoded } from "@helpers/auth/auth.service";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper";
import {
  NotificationContext,
  NotificationTypes,
} from "@context/Notification.context";
import { AuthContext } from "@context/auth/signin/Signin.context";
import { signInService, SignInFormData } from "./signin.service";

interface SignInProps {
  switchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ switchToSignUp }) => {
  const context = useContext(AuthContext);
  const alertManager = useContext(NotificationContext);
  const redirectTo = useRedirectWithMessage();

  if (!context)
    throw new Error("No se puede renderizar el componente fuera del proveedor");

  const { saveToken } = context;

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      const response = await signInService(data);
      saveToken(response.token);
      const token_user = getTokenDecoded(response.token);
      redirectTo(
        `/dashboard/${token_user?.rol_id === 2 ? "admin" : "client"}`,
        `Bienvenido, ${token_user?.nombre_completo}`,
        NotificationTypes.SUCCESS
      );
    } catch (error) {
      alertManager?.showError(`${error}`);
    }
  };

  return (
    <div className="p-6 space-y-6 sm:p-8">
      <SignInForm onSubmit={onSubmit} />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        ¿No tienes cuenta?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            switchToSignUp();
          }}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Crear cuenta
        </a>
      </p>
    </div>
  );
};

export default SignIn;
