import React, { useContext } from "react";
import { UseFormRegister, FormState, SubmitHandler } from "react-hook-form";
import { InputField, Checkbox, Button } from "../../forms/Form";
import { SignUpFormData, SignUpProps } from "@services/users/signup.types";
import { AuthContext } from "@context/auth/signin/Signin.context";

interface SignUpFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FormState<SignUpFormData>["errors"];
  handleSubmit: (
    onSubmit: SubmitHandler<SignUpFormData>
  ) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: SubmitHandler<SignUpFormData>;
  switchToSignIn: SignUpProps["switchToSignIn"];
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  switchToSignIn,
}) => {
  const authContext = useContext(AuthContext);
  const token_decoded = authContext?.getDecodedToken();

  return (
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
      {/* OPTIONAL PART TO INJECT THE USER TYPE */}
      {token_decoded?.rol_id === 2 && (
        <div className="flex space-x-4">
          <label
            htmlFor="user_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tipo de Usuario
          </label>
          <select
            id="user_type"
            {...register("rol_id")}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="1">Cliente</option>
            <option value="2">Operativo</option>
          </select>
          {errors.rol_id && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.rol_id.message}
            </p>
          )}
        </div>
      )}

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
            if (switchToSignIn) {
              switchToSignIn();
            }
          }}
        >
          Iniciar sesión
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
