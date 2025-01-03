import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField, Checkbox, Button } from "../../forms/Form";
import { signInSchema } from "./signin.validations";
import { SignInFormData } from "./signin.service";

interface SignInFormProps {
  onSubmit: SubmitHandler<SignInFormData>;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputField
        id="email"
        name="email"
        label="Tu correo electrónico"
        type="email"
        placeholder="mail@domain.com"
        registration={register("email")}
        error={errors.email}
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
    </form>
  );
};
